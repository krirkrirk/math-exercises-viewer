import { setPriority } from "os";
import { FunctionVariations } from "./types";

type Props = {
  variations: FunctionVariations[]
  width:number,
  height:number
};



export const SvgDisplay = ({ variations, width, height}: Props) => {
    return <svg xmlns="http://www.w3.org/2000/svg">
        <VariationTab width={width} height={height}/>
        <VariationsDisplay width={width} height={height} variations={variations}></VariationsDisplay>
    </svg>
};


const VariationTab = ({width,height} : {width:number,height:number}) => {
    return <g>
        <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={40} x2={width} y2={40} stroke="black"/>
        <line x1={40} y1={1} x2={40} y2={height} stroke="black"/>
        <text x={17} y={25}>x</text>
        <text x={10} y={(height-40)/2+40}>f(x)</text>
    </g>
}


const VariationsDisplay = ({variations,width,height} : Props ) => {
    console.log("VairationDisplai",width,height)

    const variationWidth = (width-40)/variations.length

    let result : JSX.Element[] = []

    const ySign = (height-40)/2+42
    const yX = 25;


    let xX = 50;
    let xSign = 65

    let variation;

    let xXStep = (285-50)/(variations.length*3-1)

    const getVariationXJSXElements = (variation:FunctionVariations) => {
        const elements = []
        const start = variation.start
        const end = variation.end

        elements.push(
            <text x={xX} y={yX}>{start}</text>
        )

        xX = xX + xXStep

        if (variation.zero) {
            elements.push(
                <text x={xX} y={yX}>{0}</text>
            )
        }

        xX = xX + xXStep
        elements.push(
            <text x={xX} y={yX}>{end}</text>
        ) 

        xX = xX + xXStep
        
        return elements
    }

    for (let i = 0; i<variations.length ; i++){
        variation = variations[i]
        result = result.concat(getVariationXJSXElements(variation)) 
    }
    return <g>
        {result}
    </g>

}