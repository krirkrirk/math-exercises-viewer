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
    const xTabHeight = height/2-10
    const fTabHeight = height - xTabHeight
    return <g>
        <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={xTabHeight} x2={width} y2={xTabHeight} stroke="black"/>
        <line x1={40} y1={1} x2={40} y2={height} stroke="black"/>
        <text x={17} y={xTabHeight/2+5}>x</text>
        <text x={10} y={(fTabHeight/2)+xTabHeight}>f(x)</text>
    </g>
}


const VariationsDisplay = ({variations,width,height} : Props ) => {

    const xTabHeight = height/2-10
    const fTabHeight = height - xTabHeight

    let result : JSX.Element[] = []
    const ySign = (fTabHeight)/2+xTabHeight
    const yX = (xTabHeight/2)+5;

    let xX = 50;
    let xSign = 50;

    let variation;

    let xXStep = (width-15-50)/(variations.length*3-1)
    let xSignStep = (width-15-50)/(variations.length*3-1)

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
                <text x={xX} y={yX}>{variation.zero}</text>
            )
        }

        xX = xX + xXStep
        elements.push(
            <text x={xX} y={yX}>{end}</text>
        ) 

        xX = xX + xXStep
        
        return elements
    }

    const getSignVaraiationJSXElements = (variation:FunctionVariations) : JSX.Element[] => {
        const elements : JSX.Element[] = []
        const startSign = variation.startSign
        const endSign = startSign ==="+" ? "-" : "+"
        if (variation.zero){
            elements.push(<text x={xSign+xXStep/2-5} y={ySign}>{startSign}</text>)
            xSign += xSignStep
            elements.push(<text x={xSign} y={ySign}>{0}</text>)
            xSign += xSignStep
            elements.push(<text x={xSign-xXStep/2+5} y={ySign}>{endSign}</text>)
            xSign += xSignStep
        }
        return elements
    }

    for (let i = 0; i<variations.length ; i++){
        variation = variations[i]
        result = result.concat(getVariationXJSXElements(variation),getSignVaraiationJSXElements(variation)) 
    }
    return <g>
        {result}
    </g>

}