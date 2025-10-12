"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import _ from "lodash";
import { Edge } from "../GraphTypes";
import GraphDFSEducational from "../dfs/GraphDFSEducational";

type Nodes = Set<string>;
type Edges = Map<string, Map<string, string>>;

export default function Visualize() {
  const weightSeparator = ":";
  const edgeSeparator: Map<string, string> = new Map([
    ["directed", "->"],
    ["undirected", "--"],
  ]);

  const [nodes, setNodes] = useState<Nodes>(
    new Set(["1", "2", "3", "4", "5", "6", "7"]),
  );

  const [edges, setEdges] = useState<Edges>(
    new Map([
      [
        "1",
        new Map([
          ["2", ""],
          ["3", ""],
        ]),
      ],
      [
        "2",
        new Map([
          ["1", ""],
          ["4", ""],
          ["5", ""],
        ]),
      ],
      [
        "3",
        new Map([
          ["1", ""],
          ["6", ""],
          ["7", ""],
        ]),
      ],
    ]),
  );

  function formatNodesForGraph(userNodes: Nodes): { id: string }[] {
    return Array.from(userNodes).map((node) => ({ id: node }));
  }

  function formatEdgesForGraph(userEdges: Edges): Edge[] {
    const result: Edge[] = [];

    const edges: Map<string, string> = new Map();

    userEdges.forEach((targets, source) => {
      targets.forEach((weight, target) => {
        const isDirected = !userEdges.get(target)?.has(source);

        if (edges.has(source) && edges.get(source) === target) return;
        if (edges.has(target) && edges.get(target) === source) return;

        if (isDirected) {
          edges.set(source, target);
        } else {
          edges.set(source, target);
          edges.set(target, source);
        }

        result.push({
          source: { id: source },
          target: { id: target },
          directed: isDirected,
          weight,
        });
      });
    });

    return result;
  }

  function parseNodes(userNodes: string): Nodes {
    return new Set(
      userNodes.split(/\s+/).filter((line) => line.trim().length > 0),
    );
  }

  function parseEdges(nodes: Nodes, userEdges: string): Edges {
    const edges: Edges = new Map();

    userEdges
      .split(/\s+/)
      .filter((line) => {
        const [edge] = line.trim().split(weightSeparator);
        const isUndirected = line.includes(
          edgeSeparator.get("undirected") ?? "",
        );

        const edgeType = isUndirected ? "undirected" : "directed";
        const separator = edgeSeparator.get(edgeType) ?? "";

        const [source, target] = edge.split(separator);

        return (
          line.trim().length > 0 &&
          source &&
          target &&
          nodes.has(source) &&
          nodes.has(target)
        );
      })
      .forEach((line) => {
        const isUndirected = line.includes(
          edgeSeparator.get("undirected") ?? "",
        );

        const edgeType = isUndirected ? "undirected" : "directed";
        const separator = edgeSeparator.get(edgeType) ?? "";

        const [edge, weight] = line.trim().split(weightSeparator);
        const [source, target] = edge.split(separator);

        if (!edges.has(source)) {
          edges.set(source, new Map());
        }

        if (!edges.has(target)) {
          edges.set(target, new Map());
        }

        if (isUndirected) {
          edges.get(target)?.set(source, weight);
        }

        edges.get(source)?.set(target, weight);
      });

    return edges;
  }

  function stringifyEdges(userEdges: Edges): string {
    const result: string[] = [];

    const edges: Map<string, string> = new Map();

    userEdges.forEach((targets, source) => {
      targets.forEach((weight, target) => {
        const isDirected =
          userEdges.get(source)?.has(target) !=
          userEdges.get(target)?.has(source);
        const directed = isDirected ? "directed" : "undirected";

        if (edges.has(source) && edges.get(source) === target) return;
        if (edges.has(target) && edges.get(target) === source) return;

        if (isDirected) {
          edges.set(source, target);
        } else {
          edges.set(source, target);
          edges.set(target, source);
        }

        result.push(
          `${source}${edgeSeparator.get(directed)}${target}:${weight}`,
        );
      });
    });

    return result.join("\n");
  }

  function stringifyNodes(userNodes: Nodes): string {
    return Array.from(userNodes).join(" ");
  }

  const setNodesDebounced = _.debounce(
    (val: string | undefined) => setNodes(parseNodes(val || "")),
    2000,
  );
  const setEdgesDebounced = _.debounce(
    (val: string | undefined) => setEdges(parseEdges(nodes, val || "")),
    2000,
  );

  return (
    <div className="flex flex-row">
      <div>
        <GraphDFSEducational
          nodes={formatNodesForGraph(nodes)}
          edges={formatEdgesForGraph(edges)}
        />
      </div>

      <div className="flex h-screen w-1/2 max-w-2xs flex-col gap-2 p-8">
        <div className="flex h-full flex-col gap-2 p-2">
          <p>Nodes</p>

          <Editor
            height="100%"
            className="overflow-hidden rounded-lg"
            defaultLanguage="plaintext"
            defaultValue={stringifyNodes(nodes)}
            theme="vs-dark"
            onChange={setNodesDebounced}
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbers: "off",
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="flex h-full flex-col gap-2 p-2">
          <p>Edges</p>
          <Editor
            height="100%"
            className="overflow-hidden rounded-lg"
            defaultLanguage="plaintext"
            defaultValue={stringifyEdges(edges)}
            theme="vs-dark"
            onChange={setEdgesDebounced}
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbers: "off",
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
