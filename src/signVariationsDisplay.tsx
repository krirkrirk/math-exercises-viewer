import { useContext, useMemo } from "react";
import { Dimensions } from "./signTableAnswer";
import { LatexInSVG } from "./latexInSvg";
import { v4 } from "uuid";
import MarkdownParser from "./markdownParser";
import { MathLatex } from "./types";


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
    options?:Options
}

type Options = {
    start?:MathLatex;
    end?:MathLatex;
}


const inputStyle = {
    color:"black",
    width:25,
    outline:"0"
}

export const SignVariationsDisplay = ({start,setStart,end,setEnd,startSign,setStartSign,
    variations,setVariations,variationsSign,setVariationsSign,options}:States) => { 

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
        elements.push(...getVariationElement(variationIndex,xX,yX))
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

    function getVariationElement(variationIndex:number, xX:number,yX:number) {
        const correctX = ((variations[variationIndex]).length <=1) ? xX : xX - ((((+variations[variationIndex]).toFixed(2)).length-1))

        return [
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
            <line key={v4()} x1={xX+4.5} y1={dim.xTabHeight} x2={xX+4.5} y2={dim.height} stroke="black"></line>,]
    }

    const startElement = (options?.start) 
    ? <foreignObject key={v4()} x={xX} y={yX} width={50} height={25} color="black">
        <MarkdownParser text={`$${options.start.latexValue}$`}></MarkdownParser>
      </foreignObject> 
    : useMemo(()=>{
        return <foreignObject 
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
            </foreignObject>
    },[start])

    const startSignElement = useMemo(()=>{
        return <foreignObject 
                    key={v4()} x={xX+xXStep/2-8} 
                    y={ySign}color="black" width={50} height={50}>
                        <button onClick={()=>{
                            setStartSign((prev)=>prev === "+" ? "-" : "+")
                        }}>
                            <MarkdownParser text={`$${startSign}$`}></MarkdownParser>
                        </button>
                </foreignObject>
    },[startSign,variations])


    variations.forEach((value,index)=>{
        xX = xX + xXStep
        result = result.concat(
            getVariationJSXElements(index,xX,yX),
            getSignVaraiationJSXElements(index,xX,ySign,xXStep)
        ) 
    })


    const endElement = (options?.end) 
    ? <foreignObject key={v4()} x={dim.width-38} y={yX} width={50} height={25} color="black">
        <MarkdownParser text={`$${options.end.latexValue}$`}></MarkdownParser>
    </foreignObject>
    : useMemo(()=>{
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
        {startElement}
        {startSignElement}
        {result}
        {endElement}    
    </g>
    )

};
