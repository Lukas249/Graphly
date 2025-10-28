import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export type SimulationNode = Node & SimulationNodeDatum;
export type SimulationEdge = Edge & SimulationLinkDatum<SimulationNode>;

export type MarkDirectedEdgeProps = {
  sourceId: string;
  destinationId: string;
  edgeColor?: string;
  edgeLabelColor?: string;
  edgeHeadColor?: string;
};

export type MarkEdgeProps = MarkDirectedEdgeProps & { directed?: boolean };

export type MarkNodeProps = {
  nodeId: string;
  nodeColor?: string;
  strokeColor?: string;
  nodeLabelColor?: string;
};

export type Markings = {
  nodes: { [key: string]: { fill: string; stroke: string; label: string } };
  edges: {
    [key: string]: {
      [key: string]: { fill: string; head: string; label: string };
    };
  };
};

export interface GraphHandle {
  markNode: ({
    nodeId,
    nodeColor,
    strokeColor,
    nodeLabelColor,
  }: MarkNodeProps) => void;
  markEdge: ({
    sourceId,
    destinationId,
    directed,
    edgeColor,
    edgeLabelColor,
    edgeHeadColor,
  }: MarkEdgeProps) => void;
  resetMarks: () => void;
  transpose: () => void;
  getMarkings: () => Markings;
  setMarkings: (markings: Markings) => void;
  getDefaultMarkings: () => Markings;
  handleResize: () => void;
  getSelectedNode: () => string | null;
}

export interface Node {
  id: string;
}

export interface Edge {
  source: Node;
  target: Node;
  directed?: boolean;
  weight?: string;
}
