import { createContext, useContext, useEffect, useState } from "react";
import { TableValues } from "./types";
import {v4} from "uuid"
import MarkdownParser from "./markdownParser";


const inputStyle = {
    outline:"0",
    width:"100%",
    height:"100%",
}

type Props = {
    width:number,
    height:number,
    tableValues:TableValues
    setTableValues:React.Dispatch<React.SetStateAction<string[][]>>
}



type TableProps = {
    tableValues:TableValues
    upTable: {width:number,height:number}
    leftTable: {width:number,height:number} 
}

const Dimensions = createContext({width:0,height:0,upTable:{width:0,height:0},leftTable:{width:0,height:0}})


export const TableOfTwoEntries = ({width, height,tableValues,setTableValues}: Props) => {

    
    const upTable = (tableValues.lineNames.length !== 0) ? {width:width,height:Math.floor(height*0.30)} : {width:0,height:0}

    const leftTable = (tableValues.columnNames.length !== 0) ? {width:Math.floor(width*0.20), height:height} : {width:0, height:0}


    return <Dimensions.Provider value={{width:width,height:height,upTable,leftTable}}>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{margin:0}}>
                <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
                <line x1={leftTable.width} y1={1} x2={leftTable.width} y2={height} stroke="black"/>
                <line x1={1} y1={upTable.height} x2={width} y2={upTable.height} stroke="black"/>
                <ValuesDisplay tableValues={tableValues} setTableValues={setTableValues} ></ValuesDisplay>
        </svg>
    </Dimensions.Provider>
};


const ValuesDisplay = ({tableValues,setTableValues}:{tableValues:TableValues,setTableValues:any}) => {
    const dim = useContext(Dimensions)


    const remainingWidth = dim.width-dim.leftTable.width
    const remainingHeight = dim.height-dim.upTable.height

    const lineSize = (remainingHeight !== dim.height) ? remainingHeight/tableValues.lineNames.length : remainingHeight/tableValues.values.length
    const columnSize = (remainingWidth !== dim.width) ? remainingWidth/tableValues.columnNames.length : remainingWidth/tableValues.values[0].length

    const copyValues:string[][] = []

    tableValues.values.forEach((value,index)=>{
        copyValues.push([])
        value.forEach(el=>copyValues[index].push(el+""))
    })

    const [values,setValues] = useState<string[][]>(copyValues)

    useEffect(()=>{setTableValues(values)})

    useEffect(()=>{setTableValues(values)},[values])


    function getTableJSXElements(){
        const result = []

        const lineCount = (tableValues.lineNames.length!==0) ? tableValues.lineNames.length : tableValues.values.length
        const columnCount = (tableValues.columnNames.length!==0) ? tableValues.columnNames.length : tableValues.values[0].length

        let linePosition = {x1:1,x2:dim.width,y1:dim.upTable.height+lineSize,y2:dim.upTable.height+lineSize}
        let columnPosition = {x1:dim.leftTable.width+columnSize,x2:dim.leftTable.width+columnSize,y1:1,y2:dim.height}
        let valuePosition = {x:0,y:linePosition.y1 - lineSize/2}

        console.log(tableValues.values)
        for (let line = 0; line<lineCount; line ++){
            valuePosition.x = columnPosition.x1-columnSize/2
            for (let column = 0 ;column<columnCount; column++){
                if (tableValues.values[line][column] === ""){
                    result.push(getInputJSXElement(line,column,valuePosition))
                }
                else{
                    result.push(getValueJSXElement(line,column,valuePosition))
                }
                valuePosition.x+=columnSize
            }
            valuePosition.y+=lineSize
        }

        for (let line = 0; line<lineCount; line++){
            result.push(getLineJSXElement(line,linePosition))
            linePosition.y1 = linePosition.y1+lineSize
            linePosition.y2 = linePosition.y1
        }

        for (let column = 0; column<columnCount; column++){
            result.push(getLineJSXElement(column,columnPosition))
            columnPosition.x1 = columnPosition.x1+columnSize
            columnPosition.x2 = columnPosition.x1
        }
        return result
    }

    function getLineJSXElement(index:number,linePosition:any){
        const name = (linePosition.y1 === linePosition.y2) ? tableValues.lineNames[index] : tableValues.columnNames[index]
        const namePosition = {
            x:(linePosition.y1===linePosition.y2) ? dim.leftTable.width/2-5 : linePosition.x1-columnSize/2,
            y:(linePosition.y1===linePosition.y2) ? linePosition.y1-lineSize/2 : dim.upTable.height/2
        }
        return (name) ? [
            <line key={v4()} x1={linePosition.x1} y1={linePosition.y1} x2={linePosition.x2} y2={linePosition.y2} stroke="black"/>,
            <foreignObject key={v4()} x={namePosition.x} y={namePosition.y-10} width={40} height={20} color="black">
                <MarkdownParser text={`$${name}$`}></MarkdownParser>
            </foreignObject>
        ] : [ <line key={v4()} x1={linePosition.x1} y1={linePosition.y1} x2={linePosition.x2} y2={linePosition.y2} stroke="black"/>,]
    }

    function getValueJSXElement(line:number,column:number,position:any){
        return <text key={v4()} x={position.x} y={position.y}>{tableValues.values[line][column]}</text>
    }

    function getInputJSXElement(line:number,column:number,position:any){
        return <foreignObject key={v4()} x={position.x} y={position.y-15} width={40} height={20} color="black">
            <form onSubmit={(e)=>{
                e.preventDefault()
                setValues((prev)=>{
                    const newTable = prev.slice()
                    newTable[line][column] = e.target[0].value
                    return newTable
                })
            }}>
                <input style={inputStyle} defaultValue={values[line][column]}></input>
            </form>
        </foreignObject>
    }


    return <g>
        {getTableJSXElements()}
    </g>
}