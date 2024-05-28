import { FunctionVariations, Variation } from "./types";

type Props = {
  functionVariations: FunctionVariations
  width:number,
  height:number
};



export const SignTable = ({ functionVariations, width, height}: Props) => {
    return <svg xmlns="http://www.w3.org/2000/svg">
        <VariationTab width={width} height={height}/>
        <VariationsDisplay width={width} height={height} functionVariations={functionVariations}></VariationsDisplay>
    </svg>
};


const VariationTab = ({width,height} : {width:number,height:number}) => {
    const xTabHeight = height/2-10;
    const fTabHeight = height - xTabHeight;
    return <g>
        <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={xTabHeight} x2={width} y2={xTabHeight} stroke="black"/>
        <line x1={40} y1={1} x2={40} y2={height} stroke="black"/>
        <text x={17} y={xTabHeight/2+5}>x</text>
        <text x={10} y={(fTabHeight/2)+xTabHeight}>f(x)</text>
    </g>
}


const VariationsDisplay = ({functionVariations,width,height} : Props ) => {


    const xTabHeight = height/2-10;
    const fTabHeight = height - xTabHeight;

    let result : JSX.Element[] = [];
    const ySign = (fTabHeight/2)+xTabHeight+5;
    const yX = (xTabHeight/2)+5;

    let xX = 50;

    let variation: Variation;

    let xXStep = (width-15-50)/(2+functionVariations.variations.length-1);

    const getVariationXJSXElements = () : JSX.Element[]  => {
        const elements = []
        elements.push(
            <text x={xX} y={yX}>{variation.changePoint}</text>,
            <line x1={xX+4.5} y1={xTabHeight} x2={xX+4.5} y2={height} stroke="black"></line>
        )
        return elements
    }

    const getSignVaraiationJSXElements = () : JSX.Element[] => {
        const elements : JSX.Element[] = []
        
        elements.push(<text x={xX} y={ySign}>{0}</text>)

        elements.push(<text x={xX+xXStep/2} y={ySign} fontSize={25}>{variation.sign}</text>)

        return elements
    }

    result.push(
        <text x={xX} y={yX}>{functionVariations.start}</text>,
        <text x={xX+xXStep/2-8} y={ySign} fontSize={25}>{functionVariations.startSign}</text>
    )
    for (let i = 0; i<functionVariations.variations.length ; i++){
        variation = functionVariations.variations[i]
        xX = xX + xXStep
        result = result.concat(getVariationXJSXElements(),getSignVaraiationJSXElements()) 
    }
    xX = xX + xXStep
    result.push(
        <text x={(functionVariations.end+"").length > 1 ? xX -10 : xX } y={yX}>{functionVariations.end}</text>
    )
    return <g>
        {result}
    </g>

}