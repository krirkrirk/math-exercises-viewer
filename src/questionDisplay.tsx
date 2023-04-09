import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";
import { Question } from "./types";
import { useEffect } from "react";
import MathInput from "react-math-keyboard";

type Props = {
  question: Question;
  index: number;
};

export const QuestionDisplay = ({ question, index }: Props) => {
  const appletOnLoad = (app: any) => {
    app.evalCommand(`A=(${index},0)`);
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
    };
    var applet = new window.GGBApplet(params, true);
    // window.addEventListener("load", function () {
    applet.inject(`ggb-question-${index}`);
    // applet.evalCommand(`A=(${index};3)`);
    // });1
  }, []);

  return (
    <div className="border-white  bg-gray-500">
      {question.instruction && (
        <MarkdownParser>{question.instruction}</MarkdownParser>
      )}

      <p>Départ :</p>
      {question.startStatement && (
        <MathComponent tex={question.startStatement} />
      )}
      <p>Réponse : </p>
      <MathComponent tex={question.answer} />

      <p>Clavier : </p>
      <MathInput />
      <p>Geogebra : </p>
      <div id={`ggb-question-${index}`}></div>
    </div>
  );
};
