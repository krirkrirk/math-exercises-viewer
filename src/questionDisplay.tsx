import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";
import { Exercise, Question } from "./types";
import { useEffect } from "react";
import MathInput from "react-math-keyboard";
import { AnswerDisplay } from "./answerDisplay";

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
    app.setCoordSystem(
      question.coords[0],
      question.coords[1],
      question.coords[2],
      question.coords[3]
    );
  };
  console.log(question);
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

  return (
    <div className="border-white  bg-gray-900 p-3 m-2">
      {question.instruction && (
        <MarkdownParser>{question.instruction}</MarkdownParser>
      )}
      {question.startStatement && (
        <MathComponent tex={`${question.startStatement} ${exo.connector!} ?`} />
      )}
      {question.commands?.length && (
        <>
          <div id={`ggb-question-${index}`}></div>
        </>
      )}
      <p>Réponse attendue : </p>
      <AnswerDisplay
        answer={question.answer}
        answerFormat={question.answerFormat ?? "tex"}
      />
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
          <MathInput numericToolbarKeys={question.keys} />
        </>
      )}
    </div>
  );
};
