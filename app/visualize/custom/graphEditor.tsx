"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import _ from "lodash";
import { Edge, Node } from "../GraphTypes";
import { parseGraph, stringifyGraph } from "@/app/lib/graph/graphSerializer";
import {
  defaultEdgeSeparator,
  defaultWeightSeparator,
} from "@/app/lib/graph/graphFormatConfig";
import { EdgeSeparator } from "@/app/lib/graph/types";

export default function GraphEditor({
  userNodes = [],
  userEdges = [],
  weightSeparator = defaultWeightSeparator,
  edgeSeparator = defaultEdgeSeparator,
  onChange,
}: {
  userNodes?: Node[];
  userEdges?: Edge[];
  weightSeparator?: string;
  edgeSeparator?: EdgeSeparator;
  onChange?: (nodes: Node[], edges: Edge[]) => void;
}) {
  const [nodes, setNodes] = useState<Node[]>(userNodes);

  const [edges, setEdges] = useState<Edge[]>(userEdges);

  const setGraphDebounced = _.debounce((val: string | undefined) => {
    const { nodes, edges } = parseGraph(
      val || "",
      weightSeparator,
      edgeSeparator,
    );
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
      defaultValue={stringifyGraph(
        nodes,
        edges,
        weightSeparator,
        edgeSeparator,
      )}
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
