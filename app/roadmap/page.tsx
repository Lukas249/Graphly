"use client";

import React, { useState, useMemo, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import Menu from "../menu";
import { XMarkIcon } from "@heroicons/react/24/outline";

import "./problems-table.css";
import { ProblemDifficulty } from "../lib/problems/types";

const nodeWidth = 200;
const nodeHeight = 50;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
): { nodes: Node[]; edges: Edge[] } {
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

const nodeStyle = {
  backgroundColor: "var(--color-gray-dark-850)",
  borderColor: "var(--color-primary)",
  color: "white",
  borderRadius: 8,
  padding: 10,
};

const nodeClickableStyle = {
  backgroundColor: "var(--color-primary)",
  color: "white",
  borderRadius: 8,
  padding: 10,
};

const rawNodes: Node[] = [
  {
    id: "graphs",
    data: { label: "Algorytmy Grafowe" },
    style: nodeStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "search",
    data: { label: "Przeszukiwanie" },
    style: nodeStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "shortest",
    data: { label: "Najkrótsza ścieżka" },
    style: nodeStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "bfs",
    data: { label: "BFS" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "dfs",
    data: { label: "DFS" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "dijkstra",
    data: { label: "Dijkstra" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "bellman",
    data: { label: "Bellman-Ford" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "floyd",
    data: { label: "Floyd-warshall" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },

  {
    id: "toposort",
    data: { label: "Sortowanie topologiczne" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "euler",
    data: { label: "Ścieżka i cykl Eulera" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "scc",
    data: { label: "Silnie spójne składowe" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
];

const rawEdges: Edge[] = [
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

type Problem = {
  title: string;
  url: string;
  difficulty: ProblemDifficulty;
};

const problems: Record<string, Problem[]> = {
  bfs: [
    {
      title: "Average of Levels in Binary Tree",
      url: "https://leetcode.com/problems/average-of-levels-in-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Find if Path Exists in Graph",
      url: "https://leetcode.com/problems/find-if-path-exists-in-graph",
      difficulty: "Easy",
    },
    {
      title: "Cousins in Binary Tree",
      url: "https://leetcode.com/problems/cousins-in-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Flood Fill",
      url: "https://leetcode.com/problems/flood-fill",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Level Order Traversal",
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal",
      difficulty: "Medium",
    },
    {
      title: "Number of Islands",
      url: "https://leetcode.com/problems/number-of-islands",
      difficulty: "Medium",
    },
    {
      title: "Open the Lock",
      url: "https://leetcode.com/problems/open-the-lock",
      difficulty: "Medium",
    },
    {
      title: "Clone Graph",
      url: "https://leetcode.com/problems/clone-graph",
      difficulty: "Medium",
    },
    {
      title: "01 Matrix",
      url: "https://leetcode.com/problems/01-matrix",
      difficulty: "Medium",
    },
    {
      title: "Cheapest Flights Within K Stops",
      url: "https://leetcode.com/problems/cheapest-flights-within-k-stops",
      difficulty: "Medium",
    },
    {
      title: "Evaluate Division",
      url: "https://leetcode.com/problems/evaluate-division",
      difficulty: "Medium",
    },
    {
      title: "Sliding Puzzle",
      url: "https://leetcode.com/problems/sliding-puzzle",
      difficulty: "Hard",
    },
    {
      title: "Making A Large Island",
      url: "https://leetcode.com/problems/making-a-large-island",
      difficulty: "Hard",
    },
  ],
  dfs: [
    {
      title: "Binary Tree Preorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Inorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Postorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-postorder-traversal",
      difficulty: "Easy",
    },
    {
      title: "Same Tree",
      url: "https://leetcode.com/problems/same-tree",
      difficulty: "Easy",
    },
    {
      title: "Maximum Depth of Binary Tree",
      url: "https://leetcode.com/problems/maximum-depth-of-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Postorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-postorder-traversal",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Postorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-postorder-traversal",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Postorder Traversal",
      url: "https://leetcode.com/problems/binary-tree-postorder-traversal",
      difficulty: "Easy",
    },
    {
      title: "Invert Binary Tree",
      url: "https://leetcode.com/problems/invert-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Diameter of Binary Tree",
      url: "https://leetcode.com/problems/diameter-of-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Right Side View",
      url: "https://leetcode.com/problems/binary-tree-right-side-view",
      difficulty: "Medium",
    },
    {
      title: "Word Search",
      url: "https://leetcode.com/problems/word-search",
      difficulty: "Medium",
    },
    {
      title: "Minimum Height Trees",
      url: "https://leetcode.com/problems/minimum-height-trees",
      difficulty: "Medium",
    },
    {
      title: "All Paths From Source to Target",
      url: "https://leetcode.com/problems/all-paths-from-source-to-target",
      difficulty: "Medium",
    },
    {
      title: "Find Eventual Safe States",
      url: "https://leetcode.com/problems/find-eventual-safe-states",
      difficulty: "Medium",
    },
    {
      title: "Binary Tree Maximum Path Sum",
      url: "https://leetcode.com/problems/binary-tree-maximum-path-sum",
      difficulty: "Hard",
    },
    {
      title: "Sum of Distances in Tree",
      url: "https://leetcode.com/problems/sum-of-distances-in-tree",
      difficulty: "Hard",
    },
  ],
  dijkstra: [
    {
      title: "Dijkstra's algorithm",
      url: "https://takeuforward.org/plus/dsa/problems/dijkstra's-algorithm",
      difficulty: "Medium",
    },
    {
      title: "Network Delay Time",
      url: "https://leetcode.com/problems/network-delay-time",
      difficulty: "Medium",
    },
    {
      title: "Number of Ways to Arrive at Destination",
      url: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination",
      difficulty: "Medium",
    },
    {
      title:
        "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
      url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
      difficulty: "Medium",
    },
    {
      title: "Trapping Rain Water II",
      url: "https://leetcode.com/problems/trapping-rain-water-ii",
      difficulty: "Hard",
    },
    {
      title: "Second Minimum Time to Reach Destination",
      url: "https://leetcode.com/problems/second-minimum-time-to-reach-destination",
      difficulty: "Hard",
    },
  ],
  bellman: [
    {
      title: "Bellman ford algorithm",
      url: "https://takeuforward.org/plus/dsa/problems/bellman-ford-algorithm",
      difficulty: "Medium",
    },
    {
      title: "Cheapest Flights Within K Stops",
      url: "https://leetcode.com/problems/cheapest-flights-within-k-stops",
      difficulty: "Medium",
    },
    {
      title:
        "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
      url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
      difficulty: "Medium",
    },
  ],
  floyd: [
    {
      title: "Floyd warshall algorithm",
      url: "https://takeuforward.org/plus/dsa/problems/floyd-warshall-algorithm",
      difficulty: "Medium",
    },
    {
      title:
        "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
      url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
      difficulty: "Medium",
    },
  ],
  toposort: [
    {
      title: "Course Schedule",
      url: "https://leetcode.com/problems/course-schedule",
      difficulty: "Medium",
    },
    {
      title: "Course Schedule II",
      url: "https://leetcode.com/problems/course-schedule-ii",
      difficulty: "Medium",
    },
    {
      title: "Find All Possible Recipes from Given Supplies",
      url: "https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies",
      difficulty: "Medium",
    },
    {
      title: "All Ancestors of a Node in a Directed Acyclic Graph",
      url: "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph",
      difficulty: "Medium",
    },
    {
      title: "Sort Items by Groups Respecting Dependencies",
      url: "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies",
      difficulty: "Hard",
    },
    {
      title: "Largest Color Value in a Directed Graph",
      url: "https://leetcode.com/problems/largest-color-value-in-a-directed-graph",
      difficulty: "Hard",
    },
  ],
  euler: [
    {
      title: "Reconstruct Itinerary",
      url: "https://leetcode.com/problems/reconstruct-itinerary",
      difficulty: "Hard",
    },
    {
      title: "Valid Arrangement of Pairs",
      url: "https://leetcode.com/problems/valid-arrangement-of-pairs",
      difficulty: "Hard",
    },
  ],
  scc: [
    {
      title: "Kosaraju's algorithm",
      url: "https://takeuforward.org/plus/dsa/problems/kosaraju's-algorithm",
      difficulty: "Hard",
    },
    {
      title: "A Walk to Remember",
      url: "https://www.hackerearth.com/practice/algorithms/graphs/strongly-connected-components/practice-problems/algorithm/a-walk-to-remember-qualifier2/",
      difficulty: "Hard",
    },
  ],
};

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <ReactFlowProvider>
        <GraphRoadmap />
      </ReactFlowProvider>
    </div>
  );
}

function GraphRoadmap() {
  const [selectedNode, setSelectedNode] = useState("");

  const { nodes, edges } = useMemo(
    () => getLayoutedElements([...rawNodes], [...rawEdges], "TB"),
    [],
  );

  const { fitView } = useReactFlow();

  useEffect(() => {
    const onResize = () => fitView();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitView]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="max-w-layout mx-auto flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          fitView={true}
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
        <div className="bg-gray-dark w-96 overflow-y-auto rounded-lg shadow-lg">
          <div className="bg-gray-dark sticky top-0 flex flex-row items-center justify-between p-4">
            <h2 className="text-2xl font-bold text-white">
              {nodes.find((n) => n.id === selectedNode)?.data.label} - Problems
            </h2>
            <button
              onClick={() => setSelectedNode("")}
              className="cursor-pointer rounded-xl text-white shadow transition"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>
          <div className="m-3">
            <table className="problems-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {problems[selectedNode].map((p, i) => (
                  <tr key={i} className="bg-[rgba(255,255,255,0.05)]">
                    <td>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-primary)" }}
                        className="hover:underline"
                      >
                        {p.title}
                      </a>
                    </td>
                    <td
                      className={
                        p.difficulty === "Easy"
                          ? "text-green-400"
                          : p.difficulty === "Medium"
                            ? "text-orange-400"
                            : p.difficulty === "Hard"
                              ? "text-red-400"
                              : ""
                      }
                    >
                      {p.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
