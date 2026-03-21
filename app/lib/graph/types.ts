import { Edge, Node } from "@/app/visualize/core/graphTypes";

export type SeenNodes = Set<string>;
export type SeenEdges = Map<string, Map<string, string>>;

export type EdgeType = "directed" | "undirected";
export type EdgeSeparator = Map<EdgeType, string>;

export type Graph = {
  edges: Edge[];
  nodes: Node[];
};
