"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import _ from "lodash";
import { Edge, Node } from "../GraphTypes";

type Nodes = Set<string>;
type Edges = Map<string, Map<string, string>>;

export default function GraphEditor({
  userNodes = [],
  userEdges = [],
  onChange,
}: {
  userNodes?: Node[];
  userEdges?: Edge[];
  onChange?: (nodes: Node[], edges: Edge[]) => void;
}) {
  const weightSeparator = ":";
  const edgeSeparator: Map<string, string> = new Map([
    ["directed", "->"],
    ["undirected", "--"],
  ]);

  const [nodes, setNodes] = useState<Node[]>(userNodes);

  const [edges, setEdges] = useState<Edge[]>(userEdges);

  function parseGraph(userGraph: string): { edges: Edge[]; nodes: Node[] } {
    const addedEdges: Edges = new Map();
    const addedNodes: Nodes = new Set();

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

      if (source && !addedNodes.has(source)) {
        addedNodes.add(source);
        nodes.push({ id: source });
      }

      if (target && !addedNodes.has(target)) {
        addedNodes.add(target);
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

        if (!addedEdges.has(source)) {
          addedEdges.set(source, new Map());
        }

        if (!addedEdges.has(target)) {
          addedEdges.set(target, new Map());
        }

        if (!addedEdges.get(source)?.has(target)) {
          edges.push({
            source: { id: source },
            target: { id: target },
            directed: !isUndirected,
            weight: weight,
          });
        }

        if (isUndirected) {
          addedEdges.get(target)?.set(source, weight);
        }

        addedEdges.get(source)?.set(target, weight);
      });

    return { edges, nodes };
  }

  function stringifyGraph(userNodes: Node[], userEdges: Edge[]): string {
    const result: string[] = [];

    const edges: Map<string, Map<string, string>> = new Map();

    userEdges.forEach((edge) => {
      if (!edges.has(edge.source.id)) edges.set(edge.source.id, new Map());
      if (!edges.has(edge.target.id)) edges.set(edge.target.id, new Map());

      if (edges.get(edge.source.id)?.has(edge.target.id)) return;

      if (!edge.directed) {
        edges.get(edge.target.id)?.set(edge.source.id, edge.weight ?? "");
      }

      edges.get(edge.source.id)?.set(edge.target.id, edge.weight ?? "");

      result.push(
        `${edge.source.id}${edgeSeparator.get(edge.directed ? "directed" : "undirected")}${edge.target.id}:${edge.weight ?? ""}`,
      );
    });

    userNodes.forEach((node) => {
      if (edges.has(node.id)) return;
      result.push(node.id);
    });

    return result.join("\n");
  }

  const setGraphDebounced = _.debounce((val: string | undefined) => {
    const { nodes, edges } = parseGraph(val || "");
    setNodes(nodes);
    setEdges(edges);
    if (onChange) onChange(nodes, edges);
  }, 2000);

  return (
    <Editor
      height="100%"
      className="overflow-hidden rounded-lg"
      defaultLanguage="plaintext"
      theme="vs-dark"
      onChange={setGraphDebounced}
      defaultValue={stringifyGraph(nodes, edges)}
      options={{
        minimap: {
          enabled: false,
        },
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}
