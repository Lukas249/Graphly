"use client"

import { useState } from "react";
import GraphDFS from "./GraphDFS";

export default function Visualize() {

    const [nodes, setNodes] = useState([
      { id: "1" }, { id: "2" }, { id: "3" },
      { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }
    ]);

    const [edges, setEdges] = useState([
      { source: "1", target: "2" },
      { source: "1", target: "3" },
      { source: "2", target: "4" },
      { source: "3", target: "5" },
      { source: "5", target: "6" }
    ]);

    const [userNodes, setUserNodes] = useState(JSON.stringify(nodes))
    const [userEdges, setUserEdges] = useState(JSON.stringify(edges))

    function saveChanges() {
        setNodes(JSON.parse(userNodes))
        setEdges(JSON.parse(userEdges))
    }

    return (
        <div className="flex flex-row">
            <GraphDFS nodes={nodes} edges={edges}/>

            <div className="flex flex-col">
                <div>
                    Nodes
                    <textarea value={userNodes} onChange={(e) => setUserNodes(e.currentTarget.value)}></textarea>
                </div>

                <div>
                    Edges
                    <textarea value={userEdges} onChange={(e) => setUserEdges(e.currentTarget.value)}></textarea>
                </div>

                <button onClick={saveChanges}>Submit</button>
            </div>
        </div>
    )
}