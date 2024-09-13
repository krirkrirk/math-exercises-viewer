import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";

type Props = {
  ggbAnswer: string[];
};

export const GGBAnswerDisplay = ({ ggbAnswer }: Props) => {
  const stringAns = ggbAnswer.toString();
  return <p className="m-0">{stringAns}</p>;
};
