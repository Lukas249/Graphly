import { Edge, Node } from "@/app/visualize/core/graphTypes";
import { Adjacency } from "@/app/lib/graph/types";

export function buildAdjacency(nodes: Node[], edges: Edge[]): Adjacency {
  const adjacency: Adjacency = {};

  for (const node of nodes) {
    adjacency[node.id] = [];
  }

  for (const { source, target, directed, weight } of edges) {
    if (directed) {
      adjacency[source.id].push({ nodeId: target.id, weight: weight ?? "" });
    } else {
      adjacency[source.id].push({ nodeId: target.id, weight: weight ?? "" });
      adjacency[target.id].push({ nodeId: source.id, weight: weight ?? "" });
    }
  }

  return adjacency;
}
