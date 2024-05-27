import { MathComponent } from "mathjax-react";
import MarkdownParser from "./markdownParser";

type Props = {
  start:number,
  end:number
};

export const GGBAnswerDisplay = ({ start,end}: Props) => {
    return <svg>
        <rect width={50} height={30} x={0} y={0} style={{fill:"white",stroke:"black"}}>
        </rect>
    </svg>
};