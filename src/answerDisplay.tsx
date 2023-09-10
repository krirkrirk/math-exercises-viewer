import { MathComponent } from "mathjax-react";

type Props = {
  answerFormat: "raw" | "tex";
  answer: string;
};

export const AnswerDisplay = ({ answerFormat, answer }: Props) => {
  if (answerFormat === "raw") return <p>{answer}</p>;
  return <MathComponent tex={answer} />;
};
