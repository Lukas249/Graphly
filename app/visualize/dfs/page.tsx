"use client";

import Menu from "../../menu";
import { Edge, Node } from "../GraphTypes";
import GraphDFSEducational from "./GraphDFSEducational";

const nodes: Node[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
];

const edges: Edge[] = [
  { source: { id: "2" }, target: { id: "1" } },
  { source: { id: "1" }, target: { id: "3" } },
  { source: { id: "2" }, target: { id: "4" } },
  { source: { id: "3" }, target: { id: "5" } },
  { source: { id: "5" }, target: { id: "6" } },
  { source: { id: "2" }, target: { id: "5" } },
];

export default function Visualize() {
  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <GraphDFSEducational graphNodes={nodes} graphEdges={edges} />
    </div>
  );
}
