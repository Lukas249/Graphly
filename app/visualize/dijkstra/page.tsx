"use client";

import Menu from "../../menu";
import { Edge, Node } from "../GraphTypes";
import GraphDijkstraEducational from "./GraphDijkstraEducational";

const nodes: Node[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
];

const edges: Edge[] = [
  { source: { id: "1" }, target: { id: "2" }, directed: true, weight: "6" },
  { source: { id: "1" }, target: { id: "3" }, directed: true, weight: "3" },
  { source: { id: "2" }, target: { id: "4" }, directed: true, weight: "1" },
  { source: { id: "3" }, target: { id: "5" }, directed: true, weight: "8" },
  { source: { id: "5" }, target: { id: "6" }, directed: true, weight: "5" },
  { source: { id: "2" }, target: { id: "5" }, directed: true, weight: "2" },
];

export default function Visualize() {
  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <GraphDijkstraEducational graphNodes={nodes} graphEdges={edges} />
    </div>
  );
}
