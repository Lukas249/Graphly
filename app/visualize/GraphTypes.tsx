export interface GraphHandle {
  markNode: (nodeId: string, nodeColor?: string, strokeColor?: string, nodeLabelColor?: string) => void
  markEdge: (sourceId: string, destiantionId: string, edgeColor?: string, edgeLabelColor?: string, edgeHeadColor?: string) => void
  resetMarks: () => void
}

export interface Node {
    id: string
}

export interface Edge {
  source: Node
  target: Node
  directed?: boolean
  weight?: string
}