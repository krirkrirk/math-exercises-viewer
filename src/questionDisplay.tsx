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
  useEffect(() => {
    var params = {
      appName: "classic",
      perspective: "G",
      width: 400,
      height: 300,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
    };
    var applet = new window.GGBApplet(params, true);
    // window.addEventListener("load", function () {
    applet.inject(`ggb-question-${index}`);
    // });
  }, []);
  return (
    <div className="border-white  bg-gray-500">
      {question.instruction && (
        <MarkdownParser>{question.instruction}</MarkdownParser>
      )}
      <MarkdownParser>{`
      |af|af|
      |--|--|
      |zz|zz|
      
      `}</MarkdownParser>
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
