import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LatexInSVG } from "./latexInSvg";
import MarkdownParser from "./markdownParser";
import { v4 } from "uuid";
import { FunctionVariations, Variation } from "./types";

type Props = {
  width:number,
  height:number,
  setSvgState?:React.Dispatch<React.SetStateAction<FunctionVariations>>,
  extractDataButton?:boolean;
};

type States = {
    start:string,
    setStart:React.Dispatch<React.SetStateAction<string>>
    end:string,
    setEnd:React.Dispatch<React.SetStateAction<string>>,
    startSign:string,
    setStartSign:React.Dispatch<React.SetStateAction<"+"|"-">>,
    variations:string[],
    setVariations:React.Dispatch<React.SetStateAction<string[]>>,
    variationsSign:string[],
    setVariationsSign:React.Dispatch<React.SetStateAction<("+"|"-")[]>>;
}

const inputStyle = {
    color:"black",
    width:25,
    outline:"0"
}


const Dimensions = createContext({width:0,height:0,xTabHeight:0,fTabHeight:0,xTabWidth:0})



export const SignTableAnswer = ({width, height,setSvgState,extractDataButton}: Props) => {

    const xTabHeight = Math.floor(height/2-10);

    const fTabHeight = height - xTabHeight;

    const xTabWidth = Math.floor(width*0.15);

    const [start,setStart] = useState<string>("-15");

    const [startSign,setStartSign] = useState<"+"|"-">("+");

    const [end,setEnd] = useState<string>("15");


    const [variations, setVariations] = useState<string[]>([]);
    const [variationsSign, setVariationsSign] = useState<("+"|"-")[]>([]);


    function exportSvgSignTableData():FunctionVariations{
        const variationsResult: Variation[] = []
        for (let i=0; i<variations.length; i++){
            const variation = variations[i];
            const sign = variationsSign[i];
            const variationFormat = {changePoint:{latexValue:variation,mathValue:+variation},sign}
            variationsResult.push(variationFormat)
        }
        return {
            start:{latexValue:start,mathValue:+start},
            startSign,
            end:{latexValue:end,mathValue:+end},
            variations:variationsResult
        }
    }

    function handleAddVariation() {
        setVariations((prev)=>prev.concat("0"))
        setVariationsSign((prev)=>prev.concat("+"))
    }

    
    useEffect(()=>{
        if (setSvgState){
            setSvgState(exportSvgSignTableData)
        }
    },[start,startSign,end,variations,variationsSign])
    

    return <div style={{display:"flex", flexDirection:"column"}}>

        <button style={{width:"max-content"}}onClick={handleAddVariation} type="submit">Ajouter Une Variation !</button>

        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{margin:0}}>
            <Dimensions.Provider value={{width,height,xTabHeight,fTabHeight,xTabWidth}}>
                <VariationTab/>
                <VariationsDisplay start={start} setStart={setStart} 
                startSign={startSign} 
                setStartSign={setStartSign} 
                end={end} 
                setEnd={setEnd} 
                variations={variations} 
                setVariations={setVariations} 
                variationsSign={variationsSign} 
                setVariationsSign={setVariationsSign}></VariationsDisplay>
                
            </Dimensions.Provider>
        </svg>
        {extractDataButton &&
        (
            <button style={{width:"max-content"}} onClick={exportSvgSignTableData} type="submit">Recupere Données !</button>
        )}
        </div> 
};



const VariationsDisplay = ({start,setStart,end,setEnd,startSign,setStartSign,
    variations,setVariations,variationsSign,setVariationsSign}:States) => { 

    const dim = useContext(Dimensions)
    let result : JSX.Element[] = [];
    const ySign = dim.xTabHeight/2+dim.xTabHeight-10;
    const yX = dim.xTabHeight/2-15;

    let xX = dim.xTabWidth+10;    
    let xXStep = Math.floor((dim.width-15-xX)/(1+variations.length));

    function handleRemoveVariation(index:number) {
        setVariations((prev)=>prev.filter((value,i)=>index!==i))
        setVariationsSign((prev)=>prev.filter((value,i)=>index!==i))
    }

    const getVariationJSXElements = (variationIndex:number, xX:number,yX:number) : JSX.Element[]  => {
        const elements = []
        const correctX = ((variations[variationIndex]).length <=1) ? xX : xX - ((((+variations[variationIndex]).toFixed(2)).length-1))
        elements.push(
            <foreignObject 
            key={v4()} x={correctX} 
            y={yX} width={60} height={60}
            >
                <div style={{width:25, display:"flex", flexDirection:"row"}}>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        setVariations((prev)=>{
                            const cpy = prev.slice()
                            //@ts-ignore
                            cpy[variationIndex] = e.target[0].value
                            return cpy
                        })
                    }}>
                        <input style={inputStyle} defaultValue={variations[variationIndex]}></input>
                    </form>
                    <button style={{width:25, height:25 ,color:"black"}} onClick={()=>handleRemoveVariation(variationIndex)}>D</button>
                </div>
            </foreignObject>,          
            <line key={v4()} x1={xX+4.5} y1={dim.xTabHeight} x2={xX+4.5} y2={dim.height} stroke="black"></line>,
        )
        return elements
    }
    
    const getSignVaraiationJSXElements = (variationSignIndex:number,xX:number,ySign:number,xXStep:number) : JSX.Element[] => {
        const elements : JSX.Element[] = []
        
        elements.push(<LatexInSVG key={v4()} latex={`$0$`} x={xX} y={ySign} width={50} height={25}/>)
    
        elements.push(
        <foreignObject key={v4()} x={xX+xXStep/2-8} y={ySign} color="black" width={50} height={50} >
            <button onClick={()=>{
            setVariationsSign((prev)=>{
                const currSign = prev[variationSignIndex]
                const copy:("+"|"-")[]= [...prev]
                copy[variationSignIndex] = (currSign === "+") ? "-" : "+"
                return copy
            })}}><MarkdownParser text={`$${variationsSign[variationSignIndex]}$`}></MarkdownParser></button>
        </foreignObject>,
        )
    
        return elements
    }

    result.push(
    <foreignObject 
        key={v4()} 
        x={xX} y={yX} 
        width={50} height={25}>
            <form onSubmit={(e)=>{
                e.preventDefault()
                //@ts-ignore
                setStart(()=>e.target[0].value)
                }}>
                <input style={inputStyle} defaultValue={start}></input>
            </form>
        </foreignObject>,
        <foreignObject 
            key={v4()} x={xX+xXStep/2-8} 
            y={ySign}color="black" width={50} height={50}>
                <button onClick={()=>{
                    setStartSign((prev)=>prev === "+" ? "-" : "+")
                }}>
                    <MarkdownParser text={`$${startSign}$`}></MarkdownParser>
                </button>
        </foreignObject>
    )

    variations.forEach((value,index)=>{
        xX = xX + xXStep
        result = result.concat(
            getVariationJSXElements(index,xX,yX),
            getSignVaraiationJSXElements(index,xX,ySign,xXStep)
        ) 
    })


    const endElement = useMemo(()=>{
        return <foreignObject
                    key={v4()}
                    x={dim.width-30} 
                    y={yX} width={50} height={25}>
                        <form onSubmit={(e)=>{
                            e.preventDefault()
                            //@ts-ignore
                            setEnd(()=>e.target[0].value)}}
                            >
                            <input style={inputStyle} defaultValue={end}></input>
                        </form>
                </foreignObject> 
    },[end])



    return (
    <g>
        {result}
        {endElement}    
    </g>
    )

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
};
