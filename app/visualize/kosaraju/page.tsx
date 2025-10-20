"use client";

import Menu from "../../menu";
import { Edge, Node } from "../GraphTypes";
import GraphKosarajuEducational from "./GraphKosarajuEducational";

const nodes: Node[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
];

const edges: Edge[] = [
  { source: { id: "2" }, target: { id: "1" }, directed: true },
  { source: { id: "1" }, target: { id: "3" }, directed: true },
  { source: { id: "2" }, target: { id: "4" }, directed: true },
  { source: { id: "3" }, target: { id: "5" }, directed: true },
  { source: { id: "5" }, target: { id: "6" }, directed: true },
  { source: { id: "5" }, target: { id: "2" }, directed: true },
];

export default function Visualize() {
  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <GraphKosarajuEducational nodes={nodes} edges={edges} />
    </div>
  );
}
