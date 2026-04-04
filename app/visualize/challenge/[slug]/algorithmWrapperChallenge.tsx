"use client";

import Menu from "@/app/menu";
import GraphEducationalChallenge from "./graphEducationalChallenge";

import { Visualization } from "@/app/lib/visualizations/types";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import _ from "lodash";

export default function AlgorithmWrapperChallenge({
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
      <GraphEducationalChallenge
        graphNodes={visualization.nodes}
        graphEdges={visualization.edges}
        pseudocode={visualization.pseudocode}
        algorithm={algorithm}
        reset={reset}
        initialStep={visualization.initial_step}
        guideText={visualization.guide_text}
        isNodeSelectionEnabled={visualization.is_node_selection_enabled}
      />
    </div>
  );
}
