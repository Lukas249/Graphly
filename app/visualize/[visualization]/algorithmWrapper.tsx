"use client";

import Menu from "@/app/menu";
import GraphEducational from "./graphEducational";

import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { Visualization } from "@/app/lib/visualizations/types";
import _ from "lodash";

export default function AlgorithmWrapper({
  visualization,
}: {
  visualization: Visualization;
}) {
  const algorithm = new Function(visualization.code)().bind({
    MinPriorityQueue,
    _,
  });

  const reset = new Function(visualization.reset_code)();

  return (
    <div className="flex h-screen flex-col">
      <Menu />
      <GraphEducational
        graphNodes={visualization.nodes}
        graphEdges={visualization.edges}
        pseudocode={visualization.pseudocode}
        algorithm={algorithm}
        reset={reset}
        initialStep={visualization.initial_step}
        isNodeSelectionEnabled={visualization.is_node_selection_enabled}
        guideText={visualization.guide_text}
      />
    </div>
  );
}
