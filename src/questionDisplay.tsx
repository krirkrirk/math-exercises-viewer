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
};

export const QuestionDisplay = ({ exo, question, index, isQCM }: Props) => {
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
    </div>
  );
};

const formatLatex = (s: string) => {
  return s.replaceAll("\\varnothing", "\\emptyset");
};
