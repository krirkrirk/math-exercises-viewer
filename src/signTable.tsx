import { FunctionVariations, Variation } from "./types";
import { LatexInSVG } from "./latexInSvg";

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
        <LatexInSVG latex={"$x$"} x={15} y={xTabHeight/2-15} width={25} height={25}></LatexInSVG>
        <LatexInSVG latex={"$f(x)$"} x={1} y={fTabHeight+10} width={50} height={50}></LatexInSVG>
     </g>
}


const VariationsDisplay = ({functionVariations,width,height} : Props ) => {

    let uniqueKey = 0;


    const xTabHeight = height/2-10;
    const fTabHeight = height - xTabHeight;

    let result : JSX.Element[] = [];
    const ySign = fTabHeight+10;
    const yX = (xTabHeight/2)-15;

    let xX = 50;

    let variation: Variation;

    let xXStep = (width-15-50)/(2+functionVariations.variations.length-1);

    const getVariationXJSXElements = () : JSX.Element[]  => {
        const elements = []
        elements.push(
            <LatexInSVG  key={uniqueKey++} latex={`$${variation.changePoint.latexValue}$`} 
                x={((variation.changePoint.latexValue).length <=1) ? xX : xX - (((variation.changePoint.mathValue+"").length-1)*5)} 
                y={yX} width={50} height={50}
            />,
            <line key={uniqueKey++} x1={xX+4.5} y1={xTabHeight} x2={xX+4.5} y2={height} stroke="black"></line>,
        )
        return elements
    }

    const getSignVaraiationJSXElements = () : JSX.Element[] => {
        const elements : JSX.Element[] = []
        
        elements.push(<LatexInSVG key={uniqueKey++} latex={`$0$`} x={xX} y={ySign} width={50} height={50}/>)

        elements.push(<LatexInSVG key={uniqueKey++} latex={`$${variation.sign}$`} x={xX+xXStep/2} y={ySign} width={50} height={50}/>)

        return elements
    }

    result.push(
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.start.latexValue}$`} x={xX} y={yX} width={50} height={50}/>,
        <LatexInSVG key={uniqueKey++} latex={`$${functionVariations.startSign}$`} x={xX+xXStep/2-8} y={ySign} width={50} height={50}/>,
    )
    for (let i = 0; i<functionVariations.variations.length ; i++){
        variation = functionVariations.variations[i]
        xX = xX + xXStep
        result = result.concat(getVariationXJSXElements(),getSignVaraiationJSXElements()) 
    }
    xX = xX + xXStep
    result.push(
        <LatexInSVG 
            key={uniqueKey++} 
            latex={`$${functionVariations.end.latexValue}$`} 
            x={(functionVariations.end.mathValue === null) ? xX -30 : xX-1-(xX+"").length }
            y={yX} 
            width={50} 
            height={50}
        />
    )
    return <g>
        {result}
    </g>

}