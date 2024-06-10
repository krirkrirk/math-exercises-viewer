import { useState } from "react"
import {v4} from "uuid"


const inputStyle = {color:"black",backgroundColor:"transparent", width:"20px", height:"20px", outline:"0"}


export const ProbaTreeDisplay = ()=> {
    const [nodes,setNodes] = useState<string[]>(["A"])
    const [childNodes,setChildNodes] = useState<number[][]>([[]])
    const [nodesPositions,setNodePosition] = useState<string[]>(["1;75"])
    const [nodesWeights, setNodesWeights] = useState<number[]>([0])


    function getJSXTree(){
        let currentNodeIndex = 0
        const result = [];
        while (currentNodeIndex<nodes.length){


            const currentIndex = currentNodeIndex;

            let nodePosition = {
                x:+nodesPositions[currentNodeIndex].split(";")[0],
                y:(+nodesPositions[currentNodeIndex].split(";")[1]) - 14
            }
            let childs = childNodes[currentNodeIndex]

            result.push(<foreignObject width={20} height={20} x={nodePosition.x} y={nodePosition.y
            }>
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    updateNodeName(currentIndex,e.target[0].value)
                }}>
                    <input style={inputStyle} defaultValue={nodes[currentIndex]}/>
                </form>
            </foreignObject>,
            )
            
            const childX = nodePosition.x + 50
            let childY = nodePosition.y - 30
            let childYStep = 70/(childs.length-1)

            childs.forEach(value=>{
                const yWeight = (childY-nodePosition.y) <= 0 ? childY - (childY-nodePosition.y)/2 - 24: childY - (childY-nodePosition.y)/2 + 5
                const xWeight = childX-((childX-nodePosition.x+10)/2);
                result.push(<line key={v4()} width={20} height={20} x1={nodePosition.x+12} y1={nodePosition.y+12} x2={childX-4} y2={childY} stroke={"black"}></line>)
                result.push(getWeightElement(value,xWeight,yWeight))
                nodesPositions[value] = `${childX};${childY}`
                childY+=childYStep;
            })

            result.push(<text key={v4()} width={10} height={10} x={nodePosition.x+2} y={nodePosition.y} onClick={()=>{
                addNode(currentIndex,"A",1)
            }}>+</text>)


            currentNodeIndex++
        }

        return result
    }



    function addNode(parentNodeIndex:number,node:string,nodeWeight:number){
        console.log(parentNodeIndex)
        const indexNode = nodes.length;
        const newChildNodes = [...childNodes,[]]
        newChildNodes[parentNodeIndex] = childNodes[parentNodeIndex].concat(indexNode)
        setNodes(prev=>nodes.concat(node))
        setChildNodes(prev=>newChildNodes)
        setNodePosition(prev=>nodesPositions.concat(""))
        setNodesWeights(prev=>nodesWeights.concat(nodeWeight))
    }


    function getWeightElement(index:number,xWeight:number,yWeight:number){
        return <foreignObject key={v4()} width={20} height={20} x={xWeight} y={yWeight} color="black">
            <form onSubmit={(e)=>{
                e.preventDefault()
                updateWeight(index,e.target[0].value)
                }}>
                <input key={v4()} style={inputStyle} defaultValue={nodesWeights[index]}></input>
            </form>
        </foreignObject>
    }

    function updateWeight(index:number,newWeight:string){
        const weights = nodesWeights.slice()
        weights[index] = +newWeight
        setNodesWeights(prev=>weights)
    }

    function updateNodeName(index:number,newName:string){
        const newNodes = nodes.slice()
        newNodes[index] = newName
        setNodes(prev=>newNodes)
    }   




    return (<svg width={300} height={150} style={{backgroundColor:"white"}}>
        {getJSXTree()}
    </svg>)
}