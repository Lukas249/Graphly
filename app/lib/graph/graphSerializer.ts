import { Edge, Node } from "../../visualize/GraphTypes";
import { EdgeSeparator, Graph, SeenEdges, SeenNodes } from "./types";

export function parseGraph(
  userGraph: string,
  weightSeparator: string,
  edgeSeparator: EdgeSeparator,
): Graph {
  const seenEdges: SeenEdges = new Map();
  const seenNodes: SeenNodes = new Set();

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const parseLine = (line: string) => {
    const [edge, weight] = line.trim().split(weightSeparator);

    const isUndirected = line.includes(edgeSeparator.get("undirected") ?? "");

    const edgeType = isUndirected ? "undirected" : "directed";
    const separator = edgeSeparator.get(edgeType) ?? "";

    const [source, target] = edge.split(separator);

    return { source, target, isUndirected, weight };
  };

  userGraph.split(/\s+/).forEach((line) => {
    const { source, target } = parseLine(line);

    if (source && !seenNodes.has(source)) {
      seenNodes.add(source);
      nodes.push({ id: source });
    }

    if (target && !seenNodes.has(target)) {
      seenNodes.add(target);
      nodes.push({ id: target });
    }
  });

  userGraph
    .split(/\s+/)
    .filter((line) => {
      const { source, target } = parseLine(line);

      return line.trim().length > 0 && source && target;
    })
    .forEach((line) => {
      const { source, target, isUndirected, weight } = parseLine(line);

      if (!seenEdges.has(source)) {
        seenEdges.set(source, new Map());
      }

      if (!seenEdges.has(target)) {
        seenEdges.set(target, new Map());
      }

      if (
        isUndirected &&
        !seenEdges.get(source)?.has(target) &&
        !seenEdges.get(target)?.has(source)
      ) {
        edges.push({
          source: { id: source },
          target: { id: target },
          directed: !isUndirected,
          weight: weight,
        });
      } else if (!isUndirected && !seenEdges.get(source)?.has(target)) {
        edges.push({
          source: { id: source },
          target: { id: target },
          directed: !isUndirected,
          weight: weight,
        });
      }

      if (isUndirected) {
        seenEdges.get(target)?.set(source, weight);
      }

      seenEdges.get(source)?.set(target, weight);
    });

  return { edges, nodes };
}

export function stringifyGraph(
  userNodes: Node[],
  userEdges: Edge[],
  weightSeparator: string,
  edgeSeparator: EdgeSeparator,
): string {
  const result: string[] = [];

  const seenEdges: SeenEdges = new Map();

  userEdges.forEach((edge) => {
    if (!seenEdges.has(edge.source.id))
      seenEdges.set(edge.source.id, new Map());
    if (!seenEdges.has(edge.target.id))
      seenEdges.set(edge.target.id, new Map());

    if (
      seenEdges.get(edge.source.id)?.has(edge.target.id) ||
      (!edge.directed && seenEdges.get(edge.target.id)?.has(edge.source.id))
    )
      return;

    if (!edge.directed) {
      seenEdges.get(edge.target.id)?.set(edge.source.id, edge.weight ?? "");
    }

    seenEdges.get(edge.source.id)?.set(edge.target.id, edge.weight ?? "");

    result.push(
      `${edge.source.id}${edgeSeparator.get(edge.directed ? "directed" : "undirected")}${edge.target.id}${weightSeparator}${edge.weight ?? ""}`,
    );
  });

  userNodes.forEach((node) => {
    if (seenEdges.has(node.id)) return;
    result.push(node.id);
  });

  return result.join("\n");
}
