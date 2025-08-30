"use client"

import { useEffect, useRef } from "react";
import GraphVisualization from "../GraphVisualization";
import { GraphHandle, Edge, Node } from "../GraphTypes";

const GraphDFS = ({nodes, edges} : {nodes: Node[], edges: Edge[]}) => {
  const graphRef = useRef<GraphHandle>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    const adjacency: any = {}

    for(const node of nodes) {
      adjacency[node.id] = []
    }
    
    for(const {source, target} of edges) {
      adjacency[source].push(target)
      adjacency[target].push(source)
    }

    async function dfs(startId: string, visited = new Set()) {
      await new Promise(resolve => {
          nextButtonRef.current!.onclick = () => {
              resolve(0)
              nextButtonRef.current!.onclick = null
          }
      });

      visited.add(startId);

      graphRef.current?.markNode(startId)
      
      for (const neighbor of adjacency[startId]) {
        if(visited.has(neighbor)) continue;

        graphRef.current?.markEdge(startId, neighbor)

        await new Promise(resolve => {
          nextButtonRef.current!.onclick = () => {
            resolve(0)
            nextButtonRef.current!.onclick = null
          }
        });

        await dfs(neighbor, visited);
      }
    }
    
    if(nodes.length) dfs(nodes[0].id)

  }, [nodes, edges]);

  return (
    <div className="flex flex-col h-screen items-center p-8 grow">
      <GraphVisualization ref={graphRef} nodes={nodes} edges={edges} directed={false} className={"grow w-full"} />
      <button className="btn inline-block" ref={nextButtonRef}>Next</button>
    </div>
  )
};

export default GraphDFS;
