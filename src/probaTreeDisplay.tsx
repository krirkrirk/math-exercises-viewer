import { useMemo, useState } from "react"
import {v4} from "uuid"


const inputStyle = {color:"black",backgroundColor:"transparent", width:"24px", height:"20px", outline:"0"}


export const ProbaTreeDisplay = ()=> {
    const [width, setWidth] = useState<number>(600)
    const [height, setHeight] = useState<number>(300)

    const [nodes,setNodes] = useState<string[]>(["A"])
    const [childNodes,setChildNodes] = useState<number[][]>([[]])
    const [nodesWeights, setNodesWeights] = useState<number[]>([1])
    const [childsYStepSize,setChildStepSize]= useState<number[]>([100])

    let nodesPositions:string[] = [`5;${Math.floor(height/2)}`]

    function getJSXTree(){
        console.log(nodesPositions)
        let currentNodeIndex = 0;
        const result = [];
        while (currentNodeIndex<nodes.length){


            const currentIndex = currentNodeIndex;

            let nodePosition = {
                x:+(nodesPositions[currentNodeIndex].split(";")[0]),
                y:(+(nodesPositions[currentNodeIndex].split(";")[1])) - 14
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

            const y1Line = nodePosition.y+12
            const x1Line = nodePosition.x+12
            
            const childYStep = childsYStepSize[currentNodeIndex]
            const childsHeight = (childs.length-1)*childYStep
            const childsWidth = 200
            const childX = nodePosition.x + childsWidth
            let childY = y1Line - Math.floor(childsHeight/2)

            const x2Line = childX-4

            if (childY+childsHeight>height-10 || childY<20){
                nodesPositions[0] = `5;${Math.floor((height+100)/2)}`
                setHeight(prev=>prev+100)
            }
            if (childX > width){
                setWidth(prev=>prev + childX-width)
            }

            childs.forEach(value=>{
                const yWeight = childY - Math.floor((childY-y1Line)/2) - 26
                const xWeight = childX-((childX-x1Line)/2)-8-nodesWeights[value];
                result.push(<line key={v4()} width={20} height={20} x1={x1Line} y1={y1Line} x2={x2Line} y2={childY} stroke={"black"}></line>)
                result.push(getWeightElement(value,xWeight,yWeight))
                nodesPositions.push(`${childX};${childY}`)
                if (childsYStepSize[currentIndex] < childNodes[value].length*childsYStepSize[value]){
                    const newChildStepSize = childsYStepSize.slice()
                    newChildStepSize[currentIndex] = childYStep + childNodes[value].length*childsYStepSize[value]-childsYStepSize[currentIndex]
                    setChildStepSize(newChildStepSize)
                }
                result.push(<foreignObject width={20} height={20} x={childX-14} y={childY-30} color="black" onClick={()=>{
                    removeNode(value)
                    }}>
                    <button key={v4()} style={{width:20, height:20}}>-</button>
                </foreignObject>)

                childY+=childYStep;
            })

            result.push(
                <foreignObject width={20} height={20} x={nodePosition.x+4} y={nodePosition.y-14} color="black" onClick={()=>{
                    addNode(currentIndex,"A",1)
                    }}>
                    <button key={v4()} style={{width:20, height:20}}>+</button>
                </foreignObject>,
            )
            console.log(nodesPositions)
            currentNodeIndex++

        }

        return result
    }



    function addNode(parentNodeIndex:number,node:string,nodeWeight:number){
        const indexNode = nodes.length;
        const newChildNodes = [...childNodes,[]]
        setChildStepSize((prev)=> prev.concat(50))
        newChildNodes[parentNodeIndex] = childNodes[parentNodeIndex].concat(indexNode)
        setNodes(nodes.concat(node))
        setChildNodes(newChildNodes)
        setNodesWeights(nodesWeights.concat(nodeWeight))
    }
    
    function removeNode(indexNodeToRemove:number){
        const newNodes:string[] = [nodes[0]]
        const newChildNodes:number[][] = [[]]
        const newNodesWeight:number[] = [nodesWeights[0]]
        const newChildStepSize:number[] = [100]
        let decalage = 0;
        for (let i = 0; i<nodes.length ; i++){
            const currentNode = i + decalage;
            if (i === indexNodeToRemove){
                decalage = decalage - 1
                continue
            } 
            childNodes[i].forEach((value)=>{
                if (value != indexNodeToRemove){
                    newNodes.push(nodes[value]);
                    newChildNodes.push([]);
                    newNodesWeight.push(nodesWeights[value])
                    newChildStepSize.push(50)
                    newChildNodes[currentNode].push(newNodes.length-1);
                }
            })
        }   
        setNodes(newNodes)
        setChildNodes(newChildNodes)
        setNodesWeights(newNodesWeight)
        setChildStepSize(newChildStepSize)
        setWidth(600)
        setHeight(300)
    }

    function getWeightElement(index:number,xWeight:number,yWeight:number){
        return <foreignObject key={v4()} width={24} height={20} x={xWeight} y={yWeight} color="black">
            <form onSubmit={(e)=>{
                e.preventDefault()
                updateWeight(index,e.target[0].value)
                }}>
                <input style={inputStyle} defaultValue={nodesWeights[index]}></input>
            </form>
        </foreignObject>
    }

    function updateWeight(index:number,newWeight:string){
        const weights = nodesWeights.slice()
        weights[index] = +newWeight
        setNodesWeights(weights)
    }

    function updateNodeName(index:number,newName:string){
        const newNodes = nodes.slice()
        newNodes[index] = newName
        setNodes(newNodes)
    }   




    return (<svg width={width} height={height} style={{backgroundColor:"white"}}>
        {getJSXTree()}
    </svg>)
}