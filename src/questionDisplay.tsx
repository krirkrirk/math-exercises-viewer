import MarkdownParser from "./markdownParser";
import { Exercise, Question } from "./types";
import { useEffect, useRef, useState } from "react";
import { AnswerDisplay } from "./answerDisplay";
import MathInput from "react-math-keyboard";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { GGBAnswerDisplay } from "./ggbAnswerDisplay";
import { ggbOnLoad } from "./ggbOnLoad";
import { ggbStudentAnswerOnLoad } from "./ggbStudentAnswerOnLoad";

type Props = {
  exo: Exercise;
  question: Question;
  index: number;
  isQCM: boolean;
  isGGB: boolean;
};

export const QuestionDisplay = ({
  exo,
  question,
  index,
  isQCM,
  isGGB,
}: Props) => {
  const [showHint, setShowHint] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const appletOnLoad = (app: any) => {
    ggbOnLoad(app, question.ggbOptions!);
  };

  const appletOnLoadGgbAns = (app: any) => {
    // const xml = app.getXML();

    // const newXML = xml.replace(
    //   /<axis id="1" .*?\/>/g,
    //   '<axis id="1" show="true" label="" unitLabel="" tickStyle="2" showNumbers="false"/>'
    // );
    // console.log(newXML);
    // console.log(app.setXML(newXML));
    console.log(question.studentGgbOptions);
    ggbStudentAnswerOnLoad(app, question.studentGgbOptions!);
  };

  useEffect(() => {
    if (!question || index === undefined) return;
    var params = {
      id: `question${index}`,
      appName: "classic",
      perspective: question.ggbOptions?.is3D ? "T" : "G",
      width: 400,
      height: 300,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      appletOnLoad: appletOnLoad,
      filename: question.ggbOptions?.lockedAxesRatio
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      showFullscreenButton: true,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-${index}`);
  }, [index, question, isGGB]);

  useEffect(() => {
    if (!isGGB) return;
    var params = {
      id: `questionAnswer${index}`,
      appName: "classic",
      perspective: "G",
      width: 400,
      height: 300,
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: false,
      customToolBar: question.studentGgbOptions?.customToolBar ?? "0||1||2",
      appletOnLoad: appletOnLoadGgbAns,
      filename: question.studentGgbOptions?.lockedAxesRatio
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      showFullscreenButton: true,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-answer-${index}`);
  }, [index, question, isGGB]);

  const [latex, setLatex] = useState("");
  const [veaResult, setVeaResult] = useState<boolean>();
  const [hint, setHint] = useState("");
  const [correction, setCorrection] = useState("");
  const [ggbVeaResult, setGgbVeaResult] = useState<boolean>();

  useEffect(() => {
    setVeaResult(undefined);
  }, [latex]);

  const vea = (input: string) => {
    fetch(`http://localhost:5000/vea?exoId=${exo.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ans: input,
        veaProps: { answer: question.answer, ...question.identifiers },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setVeaResult(res.result);
      })
      .catch((err) => console.log(err));
  };

  const mathfieldRef = useRef<any>();
  const onCopyLatex = () => {
    console.log(mathfieldRef.current);
    mathfieldRef.current.latex(question.answer);
  };

  const onCheckGGB = () => {
    //TODO Récupérer les objets crées par l'élève et vérifier si c'est ce qui est attendu

    const app = window[`questionAnswer${index}`];
    const commandsObj = app.getAllObjectNames().map((value: string) => {
      const objType = app.getObjectType(value);
      return objType === "point"
        ? `${value}=(${app.getXcoord(value)},${app.getYcoord(value)})`
        : `${value}=${app.getCommandString(value, false)}`;
    });

    fetch(`http://localhost:5000/ggbvea?exoId=${exo.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ggbAns: commandsObj,
        ggbVeaProps: { ggbAnswer: question.ggbAnswer, ...question.identifiers },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setGgbVeaResult(res.result);
      })
      .catch((err) => console.log(err));
  };
  const getXML = () => {
    const app = window[`question${index}`];
    const xml = app.getXML();
    // const newXML = xml.replace(
    //   /<axis id="1" .*?\/>/g,
    //   '<axis id="1" show="true" label="" unitLabel="" tickStyle="1" showNumbers="false"/>'
    // );
    console.log(xml);
    console.log(question.ggbOptions);
    // console.log(app.setXML(newXML));
  };

  const onDisplayGGBAnswer = () => {
    const app = window[`questionAnswer${index}`];
    question.ggbAnswer?.forEach((command) => {
      app.evalCommand(command);
    });
  };

  const onGGBClean = () => {
    const app = window[`questionAnswer${index}`];
    app.getAllObjectNames().forEach((value: string) => {
      app.deleteObject(value);
    });
  };

  const onXMLConsole = () => {
    const app = window[`question${index}`];
    console.log(app.getXML());
  };
  const onEditXML = () => {
    const app = window[`question${index}`];
    const yDelta =
      question.ggbOptions!.coords[3] - question.ggbOptions!.coords[2];
    if (yDelta > 40) {
      const xml = app.getXML().replace('distY="1"', "distY='10'");
      app.setXML(xml);
    }
  };
  return (
    <div className="border-gray-800 border-solid border bg-gray-900 p-3 mt-2 grid grid-cols-3">
      <div className="pr-8 pl-2 py-1 mr-8 col-span-2 border-solid border-transparent border-r-2 border-r-gray-700">
        {question.instruction && (
          <div className="flex items-start gap-x-2">
            <div style={{ maxWidth: "350px" }}>
              <MarkdownParser text={question.instruction}></MarkdownParser>
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(question.instruction)
              }
              className="border mb-2"
            >
              {"Copier"}
            </button>
          </div>
        )}
        {question.startStatement && (
          <div className="mt-4">
            <InlineMath
              math={`${question.startStatement} ${exo.connector!} ?`}
            />
          </div>
        )}
        {(question.hint || question.correction) && (
          <div className="mt-6">
            <div className="flex gap-x-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="border mb-2"
              >
                {showHint ? "Masquer l'indice" : "Afficher l'indice"}
              </button>
              <button
                onClick={() => setShowCorrection(!showCorrection)}
                className="border mb-2"
              >
                {showCorrection
                  ? "Masquer la correction"
                  : "Afficher la correction"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                {showHint && (
                  <MarkdownParser text={question.hint}></MarkdownParser>
                )}
              </div>
              <div>
                {showCorrection && (
                  <MarkdownParser text={question.correction}></MarkdownParser>
                )}
              </div>
            </div>
          </div>
        )}

        {question.ggbOptions?.coords?.length && (
          <>
            <div id={`ggb-question-${index}`}></div>
          </>
        )}

        {!isQCM && !isGGB && (
          <>
            <p className="mb-1 text-gray-500">Clavier : </p>{" "}
            <MathInput
              numericToolbarKeys={question.keys}
              setValue={setLatex}
              setMathfieldRef={(mf: any) => (mathfieldRef.current = mf)}
              forbidOtherKeyboardKeys={true}
            />
            <div className="flex justify-between gap-x-3">
              <p className="mt-1 mb-0">
                <span className="text-gray-500">
                  Bonne réponse officielle ?{" "}
                </span>
                {formatLatex(latex) === question.answer ? "✅" : "❌"}
              </p>
              <div className=" mt-1">
                <button onClick={() => vea(latex)} className="border ">
                  check vea
                </button>
                {veaResult !== undefined && (
                  <span className="ml-1">{veaResult ? "✅" : "❌"}</span>
                )}
              </div>
            </div>
            <p className="mt-0">
              <span className="text-gray-500">latex : </span>
              {latex}
            </p>
          </>
        )}
        {isGGB && (
          <>
            <div id={`ggb-question-answer-${index}`}></div>
            <button className=" border" onClick={onCheckGGB}>
              Check GGBVea
            </button>
            {ggbVeaResult !== undefined && (
              <span className="ml-1">{ggbVeaResult ? "✅" : "❌"}</span>
            )}
          </>
        )}
        {question?.propositions && (
          <>
            <p className="text-gray-500 mb-1">Propositions : </p>
            <div className="flex flex-col gap-y-1">
              {question?.propositions?.map((prop) => (
                <div
                  key={prop.id}
                  className="border border-solid border-gray-500 px-3 py-2"
                  style={{ maxWidth: 350 }}
                >
                  <AnswerDisplay
                    answer={prop.statement}
                    answerFormat={prop.format ?? "tex"}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ maxWidth: "350px" }}>
        <p>
          <span className="text-gray-500">Identifiers :</span>{" "}
          {JSON.stringify(question.identifiers, null, 1)}
        </p>

        {question?.ggbOptions?.coords?.length && (
          <>
            <p>
              <span className="text-gray-500">Coords :</span>{" "}
              {question.ggbOptions.coords.join(";")}
            </p>
            <button className="ml-3 border" onClick={onXMLConsole}>
              Console XML
            </button>
            <button className="ml-3 border" onClick={onEditXML}>
              Edit XML
            </button>
          </>
        )}
        <p className="text-gray-500 mb-1">Réponse attendue : </p>
        {question.answer && (
          <AnswerDisplay
            answer={question.answer}
            answerFormat={question.answerFormat ?? "tex"}
          />
        )}
        {question.ggbAnswer && (
          <GGBAnswerDisplay ggbAnswer={question.ggbAnswer} />
        )}
        {question.ggbAnswer && (
          <>
            <button className="ml-3 border" onClick={onDisplayGGBAnswer}>
              Afficher réponse
            </button>
            <button className="ml-3 border" onClick={onGGBClean}>
              Clean GGB
            </button>
          </>
        )}

        <div className="mt-2">
          <span>
            <span className="text-gray-500">latex :</span> {question.answer}
          </span>
          <button className="ml-3 border" onClick={onCopyLatex}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

const formatLatex = (s: string) => {
  return s.replaceAll("\\varnothing", "\\emptyset");
};
