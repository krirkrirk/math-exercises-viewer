import { createContext, memo, useContext, useMemo, useState } from "react";
import { LatexInSVG } from "./latexInSvg";
import { FunctionVariations, Variation } from "./types";
import MarkdownParser from "./markdownParser";
import { Test } from "./test";

type Props = {
  width:number,
  height:number
};

const Dimensions = createContext({width:0,height:0,xTabHeight:0,fTabHeight:0,xTabWidth:0})


export const SignTableAnswer = ({width, height}: Props) => {
    const xTabHeight = Math.floor(height/2-10);
    const fTabHeight = height - xTabHeight;
    const xTabWidth = Math.floor(width*0.15)

    const [variations, setVariations] = useState([]);
    const [variationsSign, setVariationsSign] = useState([])

    const [startSign,setStartSign] = useState("+");

    const VariationsDisplay = () => {


        let uniqueKey = 0;
    
        
        let result : JSX.Element[] = [];
        const ySign = fTabHeight/2+xTabHeight-10;
        const yX = xTabHeight/2-15;
    
        let xX = xTabWidth+10;
    
        let variation: string;
    
        let xXStep = Math.floor((width-15-xX)/(1+variations.length));


        
        result.push(
            <foreignObject key={++uniqueKey} x={xX+xXStep/2-8} y={ySign}color="black" width={50} height={50} onClick={()=>{
                setStartSign((prev)=>prev ==="+" ? "-" : "+")
                }}>
                <MarkdownParser text={`$${startSign}$`}></MarkdownParser>
            </foreignObject>
        )
        for (let i = 0; i<variations.length ; i++){
            variation = variations[i]
            xX = xX + xXStep
            result = result.concat(
                getVariationXJSXElements(uniqueKey,variation,xX,yX),
                getSignVaraiationJSXElements(uniqueKey,i,xX,ySign,xXStep)
            ) 
        }
        xX = xX + xXStep
    
        return <g>
            {result}            
        </g>
    
    }
    
    const getVariationXJSXElements = (uniqueKey:number, variation:string, xX:number,yX:number) : JSX.Element[]  => {
        const elements = []
        elements.push(
            <foreignObject 
            key={++uniqueKey} x={((variation).length <=1) ? xX : xX - ((((+variation).toFixed(2)).length-1)*2)} 
            y={yX} width={50} height={25}
            >
                <input></input>
            </foreignObject>,
            <LatexInSVG  key={++uniqueKey} latex={`$${variation}$`} 
                x={((variation).length <=1) ? xX : xX - ((((+variation).toFixed(2)).length-1)*2)} 
                y={yX} width={50} height={25}
            />,
            <line key={++uniqueKey} x1={xX+4.5} y1={xTabHeight} x2={xX+4.5} y2={height} stroke="black"></line>,
        )
        return elements
    }
    
    const getSignVaraiationJSXElements = (uniqueKey:number, variationSignIndex:number,xX:number,ySign:number,xXStep:number) : JSX.Element[] => {
        const elements : JSX.Element[] = []
        
        elements.push(<LatexInSVG key={++uniqueKey} latex={`$0$`} x={xX} y={ySign} width={50} height={25}/>)
    
        elements.push(
        <foreignObject key={++uniqueKey} x={xX+xXStep/2-8} y={ySign}color="black" width={50} height={50} onClick={()=>{
            setVariationsSign((prev)=>{
                const currSign = variationsSign[variationSignIndex]
                const copy:string[] = [...prev]
                copy[variationSignIndex] = (currSign === "+") ? "-" : "+"
                return copy
            })}}>
            <MarkdownParser text={`$${variationsSign[variationSignIndex]}$`}></MarkdownParser>
        </foreignObject>
    )
    
        return elements
    }


    function handleSumbit(form:React.FormEvent) {
        form.preventDefault()
        setVariations((prev)=>{
            return [...prev,"0"]
        })
        setVariationsSign((prev)=>{
            return [...prev,"+"]
        })
    }

    return <div style={{display:"flex", flexDirection:"column"}}>

        <text>Variations : </text>
        <form onSubmit={handleSumbit}>
            <input style={{color:"black"}} name={"variation"}></input>

            <button type="submit">Ajouter !</button>
        </form>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{margin:0}}>
            <Dimensions.Provider value={{width,height,xTabHeight,fTabHeight,xTabWidth}}>
                <VariationTab/>
                <VariationsDisplay></VariationsDisplay>
            </Dimensions.Provider>
        </svg>
    </div>

};
const VariationTab = () => {
    const dim = useContext(Dimensions)
    const yX = dim.xTabHeight/2-15;
    const xX = dim.xTabWidth+10;
    return <g>
        <rect width={dim.width} height={dim.height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
        <line x1={1} y1={dim.xTabHeight} x2={dim.width} y2={dim.xTabHeight} stroke="black"/>
        <line x1={dim.xTabWidth} y1={1} x2={dim.xTabWidth} y2={dim.height} stroke="black"/>
        <LatexInSVG latex={"$x$"} x={dim.xTabWidth/2-5} y={dim.xTabHeight/2-15} width={25} height={25}></LatexInSVG>
        <LatexInSVG latex={"$f(x)$"} x={dim.xTabWidth/2-18} y={dim.fTabHeight+10} width={50} height={25}></LatexInSVG>
        <foreignObject x={xX} y={yX} width={25} height={25}>
                <input style={{color:"black",border:"0",outline:"0"}} defaultValue={"-15"}></input>
        </foreignObject>,
        <foreignObject
            x={dim.width-30} 
            y={yX} width={50} height={25}>
                <input style={{color:"black",border:"0",outline:"0"}} defaultValue={"15"}></input>
        </foreignObject>
     </g>
}
