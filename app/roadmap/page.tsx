"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Menu from "@/app/menu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getLayoutedElements } from "./roadmapLayout";
import {
  difficultyClassMap,
  problemsByTopic,
  rawEdges,
  rawNodes,
} from "./roadmapData";

import "./problemsTable.css";

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

  const selectedProblems = useMemo(
    () => (selectedNode ? problemsByTopic[selectedNode] : undefined),
    [selectedNode],
  );

  const selectedNodeLabel = useMemo(
    () => nodes.find((node) => node.id === selectedNode)?.data.label,
    [nodes, selectedNode],
  );

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

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
          onNodeClick={handleNodeClick}
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

      {selectedNode && selectedProblems && (
        <div className="bg-gray-dark w-96 overflow-y-auto rounded-lg shadow-lg">
          <div className="bg-gray-dark sticky top-0 flex flex-row items-center justify-between p-4">
            <h2 className="text-2xl font-bold text-white">
              {selectedNodeLabel} - Problems
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
                {selectedProblems.map((p) => (
                  <tr key={p.url} className="bg-[rgba(255,255,255,0.05)]">
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
                    <td className={difficultyClassMap[p.difficulty]}>
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
