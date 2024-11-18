import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";

type Props = {
  answerFormat: "raw" | "tex";
  answer: string;
};

const formatLatex = (s: string) => {
  return s.replace("\\varnothing", "\\emptyset").replace("€", "e");
};

export const AnswerDisplay = ({ answerFormat, answer }: Props) => {
  if (answerFormat === "raw") return <p>{answer}</p>;
  // return <MarkdownParser text={`$${formatLatex(answer)}$`} />;
  return <MathComponent tex={formatLatex(answer)} />;
};
