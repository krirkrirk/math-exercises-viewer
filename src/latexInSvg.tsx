import MarkdownParser from "./markdownParser"

type Props = {
    latex:string,
    x:number,
    y:number,
    width:number,
    height:number
}

export const LatexInSVG = ({latex,x,y,width,height}:Props) => {
    return <foreignObject x={(latex.substring(1) ==="\\infty") ? x-10 : x} y={y} width={width} height={height} color="black">
        <MarkdownParser text={latex}></MarkdownParser>
    </foreignObject>
}