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
import { TableAnswerDisplay } from "./tableAnswerDisplay";
import { TableAnswerInput } from "./tableAnswerInput";

type Props = {
  exo: Exercise;
  question: Question;
  index: number;
  isQCM: boolean;
  isGGB: boolean;
  onReload: () => void;
};

export const formatLatexBeforeResultSend = (s: string) => {
  //removes ^{ } (si puissance puis suppression, la puissance reste)
  return s.replace(/\^\{\s\}/g, "");
};

export const QuestionDisplay = ({
  exo,
  question,
  index,
  isQCM,
  isGGB,
  onReload,
}: Props) => {
  const [showHint, setShowHint] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  // console.log(question);
  const appletOnLoad = (app: any) => {
    ggbOnLoad(app, question.ggbOptions!);
  };
  const appletCorrOnLoad = (app: any) => {
    ggbOnLoad(app, question.correctionGgbOptions!);
  };
  const appletOnLoadGgbAns = (app: any) => {
    // const xml = app.getXML();
    // const newXML = xml.replace(
    //   /<axis id="1" .*?\/>/g,
    //   '<axis id="1" show="true" label="" unitLabel="" tickStyle="2" showNumbers="false"/>'
    // );
    // console.log(newXML);
    // console.log(app.setXML(newXML));
    ggbStudentAnswerOnLoad(app, question.studentGgbOptions!);
  };

  useEffect(() => {
    if (!question || index === undefined || !showCorrection) return;
    var params = {
      id: `questioncorr${index}`,
      appName: question.correctionGgbOptions?.is3D ? "3d" : "classic",
      perspective: question.correctionGgbOptions?.is3D ? "T" : "G",
      width: question.correctionGgbOptions?.maxWidth ?? 350,
      height: question.correctionGgbOptions?.maxHeight ?? 200,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showToolBarHelp: false,
      appletOnLoad: appletCorrOnLoad,
      filename: question.correctionGgbOptions?.is3D
        ? "/geogebra-default-3D.ggb"
        : question.correctionGgbOptions?.lockedAxesRatio
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      showFullscreenButton: false,
      enableShiftDragZoom: !question.correctionGgbOptions?.forbidShiftDragZoom,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-correction-${index}`);
  }, [index, question, showCorrection]);

  useEffect(() => {
    if (!question || index === undefined) return;
    var params = {
      id: `question${index}`,
      appName: question.ggbOptions?.is3D ? "3d" : "classic",
      perspective: question.ggbOptions?.is3D ? "T" : "G",
      width: question.ggbOptions?.maxWidth ?? 350,
      height: question.ggbOptions?.maxHeight ?? 200,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showToolBarHelp: false,
      appletOnLoad: appletOnLoad,
      filename: question.ggbOptions?.is3D
        ? "/geogebra-default-3D.ggb"
        : question.ggbOptions?.lockedAxesRatio
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      showFullscreenButton: false,
      enableShiftDragZoom: !question.ggbOptions?.forbidShiftDragZoom,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-${index}`);
  }, [index, question]);

  useEffect(() => {
    if (!isGGB) return;
    var params = {
      id: `questionAnswer${index}`,
      appName: "classic",
      perspective: "G",
      width: question.studentGgbOptions?.maxWidth ?? 350,
      height: question.studentGgbOptions?.maxHeight ?? 200,
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: false,
      showToolBarHelp: false,
      customToolBar: question.studentGgbOptions?.customToolBar ?? "0||1||2",
      appletOnLoad: appletOnLoadGgbAns,
      filename: question.studentGgbOptions?.lockedAxesRatio
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      showFullscreenButton: true,
      enableShiftDragZoom: !question.studentGgbOptions?.forbidShiftDragZoom,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-answer-${index}`);
  }, [index, question, isGGB]);

  const [latex, setLatex] = useState("");
  const [tableInput, setTableInput] = useState<string[][]>(
    question.initTable ?? []
  );
  useEffect(() => {
    if (question.initTable) setTableInput(question.initTable);
  }, [question.initTable]);
  const [veaResult, setVeaResult] = useState<boolean>();
  const [tableVeaResult, setTableVeaResult] = useState<boolean>();

  const [hint, setHint] = useState("");
  const [correction, setCorrection] = useState("");
  const [ggbVeaResult, setGgbVeaResult] = useState<boolean>();

  useEffect(() => {
    setVeaResult(undefined);
  }, [latex]);

  const vea = (input: string) => {
    const url = new URL(window.location.href);
    const optionsParam = url.searchParams.get("options");
    fetch(`http://localhost:5000/vea?exoId=${exo.id}&options=${optionsParam}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ans: formatLatexBeforeResultSend(input),
        veaProps: { answer: question.answer, ...question.identifiers },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setVeaResult(res.result);
      })
      .catch((err) => console.log(err));
  };

  const tableVea = (input: string[][]) => {
    console.log(input);
    const url = new URL(window.location.href);
    const optionsParam = url.searchParams.get("options");
    fetch(
      `http://localhost:5000/tableVea?exoId=${exo.id}&options=${optionsParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ans: input,
          veaProps: {
            answerTable: question.answerTable,
            ...question.identifiers,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setTableVeaResult(res.result);
      })
      .catch((err) => console.log(err));
  };

  const mathfieldRef = useRef<any>();
  const onCopyLatex = () => {
    if (question.initTable) {
      setTableInput(question.answerTable!);
    } else {
      mathfieldRef.current.latex(question.answer);
    }
  };

  const getStudentGGBCommands = () => {
    const app = window[`questionAnswer${index}`];
    const commandsObj = app.getAllObjectNames().map((value: string) => {
      const objType = app.getObjectType(value);
      return objType === "point"
        ? `${value}=(${app.getXcoord(value)},${app.getYcoord(value)})`
        : `${value}=${app.getCommandString(value, false)}`;
    });
    return commandsObj;
  };
  const onCheckGGB = () => {
    const commandsObj = getStudentGGBCommands();

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
        setGgbVeaResult(res.result);
      })
      .catch((err) => console.log(err));
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

  const [studentGGBCommmands, setStudentGGBCommmands] = useState<string[]>([]);
  const onDisplayStudentGGBCommands = () => {
    const commands = getStudentGGBCommands();
    setStudentGGBCommmands(commands);
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
                  <MarkdownParser text={question.hint ?? ""}></MarkdownParser>
                )}
              </div>
              <div>
                {showCorrection && (
                  <>
                    <MarkdownParser
                      text={question.correction ?? ""}
                    ></MarkdownParser>
                    {question.correctionGgbOptions?.coords?.length && (
                      <>
                        <div id={`ggb-question-correction-${index}`}></div>
                      </>
                    )}
                  </>
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

        {!isQCM && !isGGB && !question.answerTable && (
          <>
            <p className="mb-1 text-gray-500">Clavier : </p>{" "}
            <MathInput
              numericToolbarKeys={question.keys}
              setValue={setLatex}
              setMathfieldRef={(mf: any) => (mathfieldRef.current = mf)}
              forbidOtherKeyboardKeys={true}
              {...question.keyboardOptions}
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
        {!!question.initTable && (
          <>
            <TableAnswerInput question={question} setTable={setTableInput} />
            <div className="flex justify-between gap-x-3">
              <div className=" mt-1">
                <button
                  onClick={() => tableVea(tableInput)}
                  className="border "
                >
                  check vea
                </button>
                {tableVeaResult !== undefined && (
                  <span className="ml-1">{tableVeaResult ? "✅" : "❌"}</span>
                )}
              </div>
            </div>
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
        <button onClick={onReload}>Reload</button>
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
        {!!question.answer && (
          <AnswerDisplay
            answer={question.answer}
            answerFormat={question.answerFormat ?? "tex"}
          />
        )}
        {question.propositions
          ?.filter((p) => p.isRightAnswer)
          .map((p) => (
            <div id={p.id}>
              <AnswerDisplay
                answer={p.statement}
                answerFormat={p.format ?? "tex"}
              />
            </div>
          ))}
        {!!question.answerTable && (
          <TableAnswerDisplay answerTable={question.answerTable} />
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
        {!!question.studentGgbOptions && (
          <>
            <button
              className="ml-3 border"
              onClick={onDisplayStudentGGBCommands}
            >
              Afficher student commands
            </button>
            <p>
              {studentGGBCommmands.map((c, index) => (
                <div key={index}>{c}</div>
              ))}
            </p>
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
