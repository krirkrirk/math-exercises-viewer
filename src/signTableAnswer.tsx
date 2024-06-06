import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LatexInSVG } from "./latexInSvg";
import { v4 } from "uuid";
import { FunctionSignVariations, MathLatex, Variation } from "./types";
import { SignVariationsDisplay } from "./signVariationsDisplay";

type Props = {
  width:number,
  height:number,
  options?:Options,
  extractDataButton?:boolean;
  setSvgState?:React.Dispatch<React.SetStateAction<FunctionSignVariations>>,
};

type Options = {
    start?:MathLatex;
    end?:MathLatex;
}

export const Dimensions = createContext({width:0,height:0,xTabHeight:0,fTabHeight:0,xTabWidth:0})


export const SignTableAnswer = ({width, height,setSvgState,extractDataButton,options}: Props) => {

    const xTabHeight = Math.floor(height/2-10);

    const fTabHeight = height - xTabHeight;

    const xTabWidth = Math.floor(width*0.15);

    const [start,setStart] = useState<string>("-15");

    const [startSign,setStartSign] = useState<"+"|"-">("+");

    const [end,setEnd] = useState<string>("15");


    const [variations, setVariations] = useState<string[]>([]);
    const [variationsSign, setVariationsSign] = useState<("+"|"-")[]>([]);


    function exportSvgSignTableData():FunctionSignVariations{
        const variationsResult: Variation[] = []
        for (let i=0; i<variations.length; i++){
            const variation = variations[i];
            const sign = variationsSign[i];
            const variationFormat = {changePoint:{latexValue:variation,mathValue:+variation},sign}
            variationsResult.push(variationFormat)
        }
        return {
            start:options?.start?? {latexValue:start,mathValue:+start},
            startSign,
            end:options?.end?? {latexValue:end,mathValue:+end},
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
                <SignVariationsDisplay start={start} setStart={setStart} 
                startSign={startSign} 
                setStartSign={setStartSign} 
                end={end} 
                setEnd={setEnd} 
                variations={variations} 
                setVariations={setVariations} 
                variationsSign={variationsSign} 
                setVariationsSign={setVariationsSign}
                options={options}></SignVariationsDisplay>
                
            </Dimensions.Provider>
        </svg>
        {extractDataButton &&
        (
            <button style={{width:"max-content"}} onClick={exportSvgSignTableData} type="submit">Recupere Données !</button>
        )}
        </div> 
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
