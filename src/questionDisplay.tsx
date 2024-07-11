import MarkdownParser from "./markdownParser";
import { Exercise, Question } from "./types";
import { useEffect, useRef, useState } from "react";
import { AnswerDisplay } from "./answerDisplay";
import MathInput from "react-math-keyboard";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { GGBAnswerDisplay } from "./ggbAnswerDisplay";

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
    if (!question.commands?.length) return;
    question.commands.forEach((command) => app.evalCommand(command));
    if (!question.coords?.length) return;

    if (question.options?.is3D) {
      // Gestion des coordonnées en 3D
      app.setCoordSystem(
        question.coords[0],
        question.coords[1],
        question.coords[2],
        question.coords[3],
        question.coords[4],
        question.coords[5]
      );
    } else {
      // Gestion des coordonnées en 2D
      app.setCoordSystem(
        question.coords[0],
        question.coords[1],
        question.coords[2],
        question.coords[3]
      );
    }

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

  const appletOnLoadGgbAns = (app: any) => {
    if (!question.studentGgbOptions?.coords?.length) return;

    if (question.studentGgbOptions?.initialCommands) {
      question.studentGgbOptions.initialCommands.forEach((command) =>
        app.evalCommand(command)
      );
    }

    app.setCoordSystem(...question.studentGgbOptions?.coords);
    if (question.studentGgbOptions?.hideAxes) {
      app.evalCommand("ShowAxes(false)");
    }
    if (question.studentGgbOptions?.hideGrid) {
      app.evalCommand("ShowGrid(false)");
    }

    const gridDistance = question.studentGgbOptions?.gridDistance;
    if (gridDistance) {
      app.setGraphicsOptions(1, {
        gridDistance: { x: gridDistance[0], y: gridDistance[1] },
      });
    }
    const isGridBold = question.studentGgbOptions?.isGridBold;
    if (isGridBold) {
      app.setGraphicsOptions(1, {
        gridIsBold: false,
      });
    }
    const isGridSimple = question.studentGgbOptions?.isGridSimple;
    if (isGridSimple) {
      app.setGraphicsOptions(1, {
        gridType: 0,
      });
    }
    const xAxisSteps = question.studentGgbOptions?.xAxisSteps ?? 1;
    const yAxisSteps = question.studentGgbOptions?.yAxisSteps ?? 1;
    const defaultValue = 2;
    app.setAxisSteps(
      question.studentGgbOptions?.xAxisSteps ||
        question.studentGgbOptions?.yAxisSteps
        ? 1
        : defaultValue,
      xAxisSteps,
      yAxisSteps
    );

    const enableShiftDragZoom =
      question.studentGgbOptions?.enableShiftDragZoom ?? false;
    app.enableShiftDragZoom(enableShiftDragZoom);

    const axisLabels = question.studentGgbOptions?.axisLabels;
    if (axisLabels) {
      app.setAxisLabels(1, axisLabels[0], axisLabels[1]);
    }
  };

  useEffect(() => {
    if (!question || index === undefined) return;
    var params = {
      id: `question${index}`,
      appName: "classic",
      perspective: question.options?.is3D ? "T" : "G",
      width: 400,
      height: 300,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      appletOnLoad: appletOnLoad,
      filename: question?.options?.isAxesRatioFixed
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
      filename:
        question?.studentGgbOptions?.isAxesRatioFixed === false
          ? "/geogebra-default-app.ggb"
          : "/geogebra-default-ortho.ggb",
      // filename: "/geogebra-default-app.ggb",
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
      return objType === "point" || objType === "vector"
        ? `(${app.getXcoord(value)};${app.getYcoord(value)})`
        : `${app.getCommandString(value)}`;
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

  return (
    <div className="border-white  bg-gray-900 p-3 m-2">
      {question.instruction && (
        <MarkdownParser text={question.instruction}></MarkdownParser>
      )}

      {question.hint && (
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="border mb-2"
          >
            {showHint ? "Masquer l'indice" : "Afficher l'indice"}
          </button>
          {showHint && <MarkdownParser text={question.hint}></MarkdownParser>}
        </div>
      )}
      {question.correction && (
        <div>
          <button
            onClick={() => setShowCorrection(!showCorrection)}
            className="border mb-2"
          >
            {showCorrection
              ? "Masquer la correction"
              : "Afficher la correction"}
          </button>
          {showCorrection && (
            <MarkdownParser text={question.correction}></MarkdownParser>
          )}
        </div>
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
      {question.answer && (
        <AnswerDisplay
          answer={question.answer}
          answerFormat={question.answerFormat ?? "tex"}
        />
      )}
      {question.ggbAnswer && (
        <GGBAnswerDisplay ggbAnswer={question.ggbAnswer} />
      )}
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
      {!isQCM && !isGGB && (
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
            Check GGBVea
          </button>
          {ggbVeaResult !== undefined && (
            <span>{ggbVeaResult ? "OK!" : "Non"}</span>
          )}
        </>
      )}
    </div>
  );
};

const formatLatex = (s: string) => {
  return s.replaceAll("\\varnothing", "\\emptyset");
};
