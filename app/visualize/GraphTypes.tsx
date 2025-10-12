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
