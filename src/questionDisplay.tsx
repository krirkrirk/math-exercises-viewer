import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";
import { Exercise, Question } from "./types";
import { useEffect, useState } from "react";
import { AnswerDisplay } from "./answerDisplay";
import MathInput from "react-math-keyboard";

type Props = {
  exo: Exercise;
  question: Question;
  index: number;
  isQCM: boolean;
};
export const QuestionDisplay = ({ exo, question, index, isQCM }: Props) => {
  const appletOnLoad = (app: any) => {
    /**
     * Ecrire ici les instructions à Geogebra
     */
    if (!question.commands?.length) return;
    question.commands.forEach((command) => app.evalCommand(command));
    if (!question.coords?.length) return;
    app.setCoordSystem(question.coords[0], question.coords[1], question.coords[2], question.coords[3]);
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
      filename: "/geogebra-default-ortho.ggb",
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
        veaProps: question.veaProps,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setVeaResult(res.result);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="border-white  bg-gray-900 p-3 m-2">
      {question.instruction && <MarkdownParser>{question.instruction}</MarkdownParser>}
      {question.startStatement && <MathComponent tex={`${question.startStatement} ${exo.connector!} ?`} />}
      {question.commands?.length && (
        <>
          <div id={`ggb-question-${index}`}></div>
        </>
      )}
      <p>Réponse attendue : </p>
      <AnswerDisplay answer={question.answer} answerFormat={question.answerFormat ?? "tex"} />
      <p>latex: {question.answer}</p>
      {question?.propositions && (
        <>
          <p>Propositions : </p>
          {question?.propositions?.map((prop) => (
            <AnswerDisplay key={prop.id} answer={prop.statement} answerFormat={prop.format ?? "tex"} />
          ))}
        </>
      )}
      {!isQCM && (
        <>
          <p>Clavier : </p>
          <MathInput numericToolbarKeys={question.keys} setValue={setLatex} />
          <p>bonne réponse officielle : {formatLatex(latex) === question.answer ? "OUI" : "NON"}</p>
          <div className="mx-3">
            <button onClick={() => vea(latex)} className="border mx-3">
              check vea
            </button>
            {veaResult !== undefined && <span>{veaResult ? "OK!" : "Non"}</span>}
          </div>
          <p>latex: {latex}</p>
        </>
      )}
    </div>
  );
};

const formatLatex = (s: string) => {
  return s.replaceAll("\\varnothing", "\\emptyset");
};
