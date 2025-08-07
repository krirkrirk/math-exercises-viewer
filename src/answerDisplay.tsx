import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";

type Props = {
  answerFormat: "raw" | "tex";
  answer: string;
};

const formatLatex = (s: string) => {
  return s.replaceAll(/\n<!--.*/g, "");

  // return s.replace("\\varnothing", "\\emptyset").replace("€", "e");
};

export const AnswerDisplay = ({ answerFormat, answer }: Props) => {
  // if (answerFormat === "tex") return <p>{answer}</p>;
  return (
    <MarkdownParser
      text={
        answerFormat === "tex"
          ? `$${formatLatex(answer)}$`
          : formatLatex(answer)
      }
    />
  );
  // return <MathComponent tex={formatLatex(answer)} />;
};
