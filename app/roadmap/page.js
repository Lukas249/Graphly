"use client"

import React, { useState, useMemo, useEffect } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import Menu from "../menu";

const nodeWidth = 200;
const nodeHeight = 50;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function getLayoutedElements(nodes, edges, direction = "TB") {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    node.position = { x: x - nodeWidth / 2, y: y - nodeHeight / 2 };
  });

  return { nodes, edges };
}

// Definicja node’ów z kolorem --color-primary
const rawNodes = [
  { id: "graphs", data: { label: "Algorytmy Grafowe" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "search", data: { label: "Przeszukiwanie" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "bfs", data: { label: "BFS" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "dfs", data: { label: "DFS" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },

  { id: "shortest", data: { label: "Najkrótsza ścieżka" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "dijkstra", data: { label: "Dijkstra" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "bellman", data: { label: "Bellman-Ford" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "floyd", data: { label: "Floyd-warshall" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },

  { id: "toposort", data: { label: "Sortowanie topologiczne" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "euler", data: { label: "Ścieżka i cykl Eulera" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
  { id: "scc", data: { label: "Silnie spójne składowe" }, style: { backgroundColor: "var(--color-primary)", color: "white", borderRadius: 8, padding: 10 } },
];

// Relacje w formie drzewa
const rawEdges = [
  { id: "e1", source: "graphs", target: "search" },
  { id: "e2", source: "search", target: "bfs" },
  { id: "e3", source: "search", target: "dfs" },

  { id: "e4", source: "dfs", target: "toposort" },
  { id: "e5", source: "dfs", target: "euler" },
  { id: "e6", source: "dfs", target: "scc" },

  { id: "e7", source: "graphs", target: "shortest" },
  { id: "e8", source: "shortest", target: "dijkstra" },
  { id: "e9", source: "shortest", target: "bellman" },
  { id: "e10", source: "shortest", target: "floyd" },
];

// Problemy / materiały do node’ów
const problems = {
  bfs: [
    { title: "Shortest Path in Binary Matrix", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/" },
    { title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/" },
  ],
  dfs: [
    { title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/" },
    { title: "Max Area of Island", url: "https://leetcode.com/problems/max-area-of-island/" },
  ],
  dijkstra: [
    { title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/" },
  ],
  bellman: [
    { title: "Negative Weight Cycle Detection", url: "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/" },
  ],
  floyd: [
    { title: "All Pairs Shortest Path", url: "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html" },
  ],
  toposort: [
    { title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/" },
  ],
  euler: [
    { title: "Eulerian Path and Circuit", url: "https://cp-algorithms.com/graph/euler_path.html" },
  ],
  scc: [
    { title: "Strongly Connected Components", url: "https://cp-algorithms.com/graph/strongly-connected-components.html" },
  ],
};

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
        <Menu />
        <ReactFlowProvider>
          <GraphRoadmap/>
        </ReactFlowProvider>
    </div>
  )
}

function GraphRoadmap() {
  const [selectedNode, setSelectedNode] = useState(null);

  const { nodes, edges } = useMemo(
    () => getLayoutedElements([...rawNodes], [...rawEdges], "TB"),
    []
  );

  const { fitView } = useReactFlow();

  useEffect(() => {
    window.addEventListener("resize", fitView)
    return () => window.removeEventListener("resize", fitView);
  }, [fitView])

  return (
    <div className="flex flex-1">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnDrag={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {selectedNode && problems[selectedNode] && (
        <div className="w-80 p-4 bg-gray-50 border-l shadow-lg overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
            {nodes.find((n) => n.id === selectedNode)?.data.label} – Problems
          </h2>
          <ul className="space-y-2">
            {problems[selectedNode].map((p, i) => (
              <li key={i}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-primary)" }}
                  className="hover:underline"
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-4 px-4 py-2 text-white rounded-xl shadow transition"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
