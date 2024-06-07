import { useState } from "react"

export const ProbaTreeDisplay = ()=> {
    const [nodes,setNodes] = useState<string[]>(["A"])
    const [childNodes,setChildNodes] = useState<number[][]>([[]])
    const [nodesPositions,setNodePosition] = useState<string[]>(["1;75"])


    function getJSXTree(){
        let currentNodeIndex = 0
        const result = [];
        while (currentNodeIndex<nodes.length){
            let node = nodes[currentNodeIndex] 
            let nodePosition = {x:+nodesPositions[currentNodeIndex].split(";")[0],y:+nodesPositions[currentNodeIndex].split(";")[1]}
            let childs = childNodes[currentNodeIndex]

            console.log(currentNodeIndex,node,nodePosition,childs,childNodes)

            result.push(<text width={20} height={20} x={nodePosition.x} y={nodePosition.y}>{node}</text>)
            
            const childX = nodePosition.x + 50
            let childY = nodePosition.y - 50
            let childYStep = 100/(childs.length-1)

            childs.forEach(value=>{
                result.push(<line width={20} height={20} x1={nodePosition.x+10} y1={nodePosition.y} x2={childX} y2={childY} stroke={"black"}></line>)
                nodesPositions[value] = `${childX};${childY}`
                childY+=childYStep;
            })

            
            if (childs.length === 0){
                const index = currentNodeIndex;
                result.push(<text width={10} height={10} x={nodePosition.x+10} y={nodePosition.y} onClick={()=>{
                    addNode(index,"Z")
                }}>+</text>)
            }


            currentNodeIndex++
        }

        return result
    }



    function addNode(parentNodeIndex:number,node:string){
        console.log(parentNodeIndex)
        const indexNode = nodes.length;
        const newChildNodes = [...childNodes,[]]
        newChildNodes[parentNodeIndex] = childNodes[parentNodeIndex].concat(indexNode)
        setNodes(prev=>nodes.concat(node))
        setChildNodes(prev=>newChildNodes)
        setNodePosition(prev=>nodesPositions.concat(""))
    }




    return (<svg width={300} height={150} style={{backgroundColor:"white"}}>
        {getJSXTree()}
    </svg>)
}