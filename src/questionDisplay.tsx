import MarkdownParser from "./markdownParser";
import { Exercise, Question } from "./types";
import { useEffect, useRef, useState } from "react";
import { AnswerDisplay } from "./answerDisplay";
import MathInput from "react-math-keyboard";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
  const appletOnLoad = (app: any) => {
    if (!question.commands?.length) return;
    question.commands.forEach((command) => app.evalCommand(command));
    if (!question.coords?.length) return;
    app.setCoordSystem(
      question.coords[0],
      question.coords[1],
      question.coords[2],
      question.coords[3]
    );
    if (question.options?.hideAxes) {
      app.evalCommand("ShowAxes(false)");
    }
    if (question.options?.hideGrid) {
      app.evalCommand("ShowGrid(false)");
    }

    const gridDistance = question.options?.gridDistance;
    if (gridDistance) {
      app.setGraphicsOptions(1, {
        gridDistance: { x: gridDistance[0], y: gridDistance[1] },
      });
    }
    const isGridBold = question.options?.isGridBold;
    if (isGridBold) {
      app.setGraphicsOptions(1, {
        gridIsBold: false,
      });
    }
    const isGridSimple = question.options?.isGridSimple;
    if (isGridSimple) {
      app.setGraphicsOptions(1, {
        gridType: 0,
      });
    }
    const axisLabels = question.options?.axisLabels;
    if (axisLabels) {
      app.setAxisLabels(1, axisLabels[0], axisLabels[1]);
    }
  };

  useEffect(() => {
    var params = {
      id: `question${index}`,
      appName: "classic",
      perspective: "G",
      width: 400,
      height: 300,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      appletOnLoad: appletOnLoad,
      filename: question?.options?.isAxesRatioFixed
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      // filename: "/geogebra-default-app.ggb",
      showFullscreenButton: true,
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
      width: 400,
      height: 300,
      showToolBar: true,
      showAlgebraInput: true,
      showMenuBar: true,
      // appletOnLoad: appletOnLoad,
      filename: question?.options?.isAxesRatioFixed
        ? "/geogebra-default-ortho.ggb"
        : "/geogebra-default-app.ggb",
      // filename: "/geogebra-default-app.ggb",
      showFullscreenButton: true,
    };
    var applet = new window.GGBApplet(params, true);
    applet.inject(`ggb-question-answer-${index}`);
  }, [index, question, isGGB]);

  const [latex, setLatex] = useState("");
  const [veaResult, setVeaResult] = useState<boolean>();

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
    const commandsObj = app.getAllObjectNames().map((value:string)=>{
      const objType = app.getObjectType(value);
      return (objType === "point") ? `${value}=(${app.getXcoord(value)},${app.getYcoord(value)})` : `${value} = ${app.getCommandString(value)}`}
    )
    console.log(commandsObj)
    //! toutes les commandes ggb sont dispo ici : https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API

    // par example on peut faire app.getAllObjectNames() pour avoir les noms de tous les objets présents dans le GGB

    // Force & honneur :)
  };


  return (
    <div className="border-white  bg-gray-900 p-3 m-2">
      {question.instruction && (
        <MarkdownParser text={question.instruction}></MarkdownParser>
      )}

      {question.startStatement && (
        <InlineMath math={`${question.startStatement} ${exo.connector!} ?`} />
      )}
      {question.commands?.length && (
        <>
          <div id={`ggb-question-${index}`}></div>
        </>
      )}
      <p>Coords : {question.coords?.join(";")}</p>
      <p>Réponse attendue : </p>
      <AnswerDisplay
        answer={question.answer}
        answerFormat={question.answerFormat ?? "tex"}
      />
      <div>
        <span>latex: {question.answer}</span>
        <button className="ml-3 border" onClick={onCopyLatex}>
          Copy
        </button>
      </div>
      {question?.propositions && (
        <>
          <p>Propositions : </p>
          {question?.propositions?.map((prop) => (
            <AnswerDisplay
              key={prop.id}
              answer={prop.statement}
              answerFormat={prop.format ?? "tex"}
            />
          ))}
        </>
      )}
      {!isQCM && (
        <>
          <p>Clavier : </p>
          <MathInput
            numericToolbarKeys={question.keys}
            setValue={setLatex}
            setMathfieldRef={(mf: any) => (mathfieldRef.current = mf)}
            forbidOtherKeyboardKeys={true}
          />
          <p>
            bonne réponse officielle :{" "}
            {formatLatex(latex) === question.answer ? "OUI" : "NON"}
          </p>
          <div className="mx-3">
            <button onClick={() => vea(latex)} className="border mx-3">
              check vea
            </button>
            {veaResult !== undefined && (
              <span>{veaResult ? "OK!" : "Non"}</span>
            )}
          </div>
          <p>latex: {latex}</p>
          <p>Identiifers : {JSON.stringify(question.identifiers)}</p>
        </>
      )}
      {isGGB && (
        <>
          <div id={`ggb-question-answer-${index}`}></div>
          <button className="ml-3 border" onClick={onCheckGGB}>
            Check
          </button>
        </>
      )}
    </div>
  );
};

const formatLatex = (s: string) => {
  return s.replaceAll("\\varnothing", "\\emptyset");
};
