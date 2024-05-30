import { FunctionVariations, Variation } from "./types";
import { LatexInSVG } from "./latexInSvg";
import { createContext, useContext } from "react";

type Props = {
  functionVariations: FunctionVariations
  width:number,
  height:number
};

const Dimensions = createContext({width:0,height:0,xTabHeight:0,fTabHeight:0,xTabWidth:0})


export const SignTable = ({ functionVariations, width, height}: Props) => {
    const xTabHeight = Math.floor(height/2-10);
    const fTabHeight = height - xTabHeight;
    const xTabWidth = Math.floor(width*0.15)
    return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{margin:0}}>
        <Dimensions.Provider value={{width,height,xTabHeight,fTabHeight,xTabWidth}}>
            <VariationTab/>
            <VariationsDisplay functionVariations={functionVariations}></VariationsDisplay>
        </Dimensions.Provider>
    </svg>
};


const VariationTab = () => {
    const dim = useContext(Dimensions)
    return <g>
        <rect width={dim.width} height={dim.height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={dim.xTabHeight} x2={dim.width} y2={dim.xTabHeight} stroke="black"/>
        <line x1={dim.xTabWidth} y1={1} x2={dim.xTabWidth} y2={dim.height} stroke="black"/>
        <LatexInSVG latex={"$x$"} x={dim.xTabWidth/2-5} y={dim.xTabHeight/2-15} width={25} height={25}></LatexInSVG>
        <LatexInSVG latex={"$f(x)$"} x={dim.xTabWidth/2-18} y={dim.fTabHeight+10} width={50} height={25}></LatexInSVG>
     </g>
}


const VariationsDisplay = ({functionVariations}:{functionVariations:FunctionVariations} ) => {

    let uniqueKey = 0;

    const dim = useContext(Dimensions)

    const xTabHeight = dim.xTabHeight;
    const fTabHeight = dim.fTabHeight;

    let result : JSX.Element[] = [];
    const ySign = fTabHeight/2+xTabHeight-10;
    const yX = xTabHeight/2-15;

    let xX = dim.xTabWidth+10;

    let variation: Variation;

    let xXStep = Math.floor((dim.width-15-xX)/(1+functionVariations.variations.length));

    
    result.push(
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.start.latexValue}$`} x={xX} y={yX} width={50} height={25}/>,
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.startSign}$`} x={xX+xXStep/2-8} y={ySign} width={50} height={25}/>,
    )
    for (let i = 0; i<functionVariations.variations.length ; i++){
        variation = functionVariations.variations[i]
        xX = xX + xXStep
        result = result.concat(
            getVariationXJSXElements(uniqueKey,variation,xX,yX),
            getSignVaraiationJSXElements(uniqueKey,variation,xX,ySign,xXStep)
        ) 
    }
    xX = xX + xXStep
    result.push(
        <LatexInSVG 
            key={uniqueKey++} 
            latex={`$${functionVariations.end.latexValue}$`} 
            x={(functionVariations.end.mathValue === null) ? xX - 30 : xX - (functionVariations.end.mathValue.toFixed(0)).length*7}
            y={yX} 
            width={50} 
            height={25}
        />
    )

    return <g>
        {result}
    </g>

}

const getVariationXJSXElements = (uniqueKey:number, variation:Variation, xX:number,yX:number) : JSX.Element[]  => {
    const dim = useContext(Dimensions)
    const elements = []
    elements.push(
        <LatexInSVG  key={uniqueKey++} latex={`$${variation.changePoint.latexValue}$`} 
            x={((variation.changePoint.latexValue).length <=1) ? xX : xX - (((variation.changePoint.mathValue.toFixed(2)).length-1)*2)} 
            y={yX} width={50} height={25}
        />,
        <line key={uniqueKey++} x1={xX+4.5} y1={dim.xTabHeight} x2={xX+4.5} y2={dim.height} stroke="black"></line>,
    )
    return elements
}

const getSignVaraiationJSXElements = (uniqueKey:number, variation:Variation, xX:number,ySign:number,xXStep:number) : JSX.Element[] => {
    const elements : JSX.Element[] = []
    
    elements.push(<LatexInSVG key={uniqueKey++} latex={`$0$`} x={xX} y={ySign} width={50} height={25}/>)

    elements.push(<LatexInSVG key={uniqueKey++} latex={`$${variation.sign}$`} x={xX+xXStep/2} y={ySign} width={50} height={25}/>)

    return elements
}