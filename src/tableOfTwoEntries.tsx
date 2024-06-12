import { createContext, useContext, useState } from "react";
import { TableValues } from "./types";


type Props = {
    width:number,
    height:number,
    tableValues:TableValues
}



type TableProps = {
    tableValues:TableValues
    upTable: {width:number,height:number}
    leftTable: {width:number,height:number} 
}

const Dimensions = createContext({width:0,height:0,upTable:{width:0,height:0},leftTable:{width:0,height:0}})


export const TableOfTwoEntries = ({width, height,tableValues}: Props) => {

    
    const upTable = {width:width,height:Math.floor(height*0.30)}

    const leftTable = {width:Math.floor(width*0.20), height:height}



    return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} style={{margin:0}}>
        <VariationTab width={width} 
        height={height} upTable={upTable} 
        leftTable={leftTable} tableValues={tableValues}/>
    </svg>
};



const VariationTab = ({width,height,upTable,leftTable,tableValues}:TableProps & Props) => {

    return <Dimensions.Provider value={{width,height,upTable,leftTable}}>
        <g>
            <rect width={width} height={height} x={1} y={1} style={{fill:"white",stroke:"black",strokeWidth:1}}/>
            <line x1={leftTable.width} y1={1} x2={leftTable.width} y2={height} stroke="black"/>
            <line x1={1} y1={upTable.height} x2={width} y2={upTable.height} stroke="black"/>
            <ValuesDisplay tableValues={tableValues} ></ValuesDisplay>
        </g>
     </Dimensions.Provider>
};



const ValuesDisplay = ({tableValues}:{tableValues:TableValues}) => {
    const dim = useContext(Dimensions)

    const remainingWidth = dim.width-dim.upTable.width
    const remainingHeight = dim.height-dim.leftTable.height

    const lineSize = Math.floor(remainingHeight/tableValues.linesNames.length)
    const columnSize = Math.floor(remainingWidth/tableValues.columnNames.length)

    return <g>

    </g>
}