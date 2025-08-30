export interface GraphHandle {
  markNode: (nodeId: string) => void
  markEdge: (sourceId: string, destiantionId: string) => void
  resetMarks: () => void
}

export interface Node {
    id: string
}

export interface Edge {
  source: string
  target: string
}