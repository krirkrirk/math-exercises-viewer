import { useState } from "react";
import MarkdownParser from "./markdownParser"

type Props = {
    x:number,
    y:number
}

export const Test = ({x,y}:Props)=>{

    const [sign,setSign] = useState("+");

    return <foreignObject x={x} y={y}color="black" width={50} height={50} onClick={()=>{
        setSign((prev)=>prev ==="+" ? "-" : "+")
        console.log("clicked")
        }} on>
        <MarkdownParser text={`$${sign}$`}></MarkdownParser>
    </foreignObject>
}