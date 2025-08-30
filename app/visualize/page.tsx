"use client"

import { useRef } from "react";
import Menu from "../menu";
import { GraphHandle } from "./GraphTypes";
import GraphDFSEducational from "./GraphDFSEducational";

export default function Visualize() {
    const nodes = [
      { id: "1" }, { id: "2" }, { id: "3" },
      { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }
    ];
    
    const links = [
      { source: "1", target: "2" },
      { source: "1", target: "3" },
      { source: "2", target: "4" },
      { source: "3", target: "5" },
      { source: "5", target: "6" },
      { source: "1", target: "7" },
      { source: "7", target: "1" }
    ];
    
    const graphRef = useRef<GraphHandle>(null)


    return (
        <div className="flex flex-col h-screen">
            <Menu />
            <GraphDFSEducational />
        </div>
    )
}
