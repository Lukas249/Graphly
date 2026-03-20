import { Edge, Node } from "reactflow";

import { ProblemDifficulty } from "../lib/problems/types";

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

export const rawNodes: Node[] = [
  {
    id: "graphs",
    data: { label: "Graph Algorithms" },
    style: nodeStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "search",
    data: { label: "Graph Traversal" },
    style: nodeStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "shortest",
    data: { label: "Shortest Path" },
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
    data: { label: "Floyd-Warshall" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "toposort",
    data: { label: "Topological Sort" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "euler",
    data: { label: "Eulerian Path and Cycle" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
  {
    id: "scc",
    data: { label: "Strongly Connected Components" },
    style: nodeClickableStyle,
    position: { x: 0, y: 0 },
  },
];

export const rawEdges: Edge[] = [
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

export type RoadmapProblem = {
  title: string;
  url: string;
  difficulty: ProblemDifficulty;
};

export const difficultyClassMap: Record<ProblemDifficulty, string> = {
  Easy: "text-green-400",
  Medium: "text-orange-400",
  Hard: "text-red-400",
};

export const problemsByTopic: Record<string, RoadmapProblem[]> = {
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
