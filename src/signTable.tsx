import { FunctionVariations, Variation } from "./types";
import { LatexInSVG } from "./latexInSvg";
import { createContext, useContext } from "react";

type Props = {
  functionVariations: FunctionVariations
  width:number,
  height:number
};

const Dimensions = createContext({width:0,height:0,xTabHeight:0,fTabHeight:0})


export const SignTable = ({ functionVariations, width, height}: Props) => {
    const xTabHeight = height/2-10;
    const fTabHeight = height - xTabHeight;
    return <svg xmlns="http://www.w3.org/2000/svg">
        <Dimensions.Provider value={{width,height,xTabHeight,fTabHeight}}>
            <VariationTab width={width} height={height}/>
            <VariationsDisplay width={width} height={height} functionVariations={functionVariations}></VariationsDisplay>
        </Dimensions.Provider>
    </svg>
};


const VariationTab = ({width,height} : {width:number,height:number}) => {
    const dim = useContext(Dimensions)
    return <g>
        <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={dim.xTabHeight} x2={width} y2={dim.xTabHeight} stroke="black"/>
        <line x1={40} y1={1} x2={40} y2={height} stroke="black"/>
        <LatexInSVG latex={"$x$"} x={15} y={dim.xTabHeight/2-15} width={25} height={25}></LatexInSVG>
        <LatexInSVG latex={"$f(x)$"} x={1} y={dim.fTabHeight+10} width={50} height={50}></LatexInSVG>
     </g>
}


const VariationsDisplay = ({functionVariations,width,height} : Props ) => {

    let uniqueKey = 0;

    const dim = useContext(Dimensions)

    const xTabHeight = dim.xTabHeight;
    const fTabHeight = dim.fTabHeight;

    let result : JSX.Element[] = [];
    const ySign = fTabHeight+10;
    const yX = (xTabHeight/2)-15;

    let xX = 50;

    let variation: Variation;

    let xXStep = (width-15-50)/(2+functionVariations.variations.length-1);

    
    result.push(
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.start.latexValue}$`} x={xX} y={yX} width={50} height={50}/>,
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.startSign}$`} x={xX+xXStep/2-8} y={ySign} width={50} height={50}/>,
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
            x={(functionVariations.end.mathValue === null) ? xX -30 : xX - (functionVariations.end.mathValue+"").length*5}
            y={yX} 
            width={50} 
            height={50}
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
            x={((variation.changePoint.latexValue).length <=1) ? xX : xX - (((variation.changePoint.mathValue+"").length-1)*5)} 
            y={yX} width={50} height={50}
        />,
        <line key={uniqueKey++} x1={xX+4.5} y1={dim.xTabHeight} x2={xX+4.5} y2={dim.height} stroke="black"></line>,
    )
    return elements
}

const getSignVaraiationJSXElements = (uniqueKey:number, variation:Variation, xX:number,ySign:number,xXStep:number) : JSX.Element[] => {
    const elements : JSX.Element[] = []
    
    elements.push(<LatexInSVG key={uniqueKey++} latex={`$0$`} x={xX} y={ySign} width={50} height={50}/>)

    elements.push(<LatexInSVG key={uniqueKey++} latex={`$${variation.sign}$`} x={xX+xXStep/2} y={ySign} width={50} height={50}/>)

    return elements
}