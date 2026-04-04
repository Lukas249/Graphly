import { RefObject } from "react";
import { GraphHandle } from "../../core/graphTypes";
import { TutorialRef } from "../../core/tutorial";
import { Adjacency } from "../../[visualization]/types";

export type ChallengeVisualizationRefs = {
  graphRef: RefObject<GraphHandle | null>;
  tutorialRef: RefObject<TutorialRef<Record<string, unknown>> | null>;
};

export type ChallengeAlgorithmParams = ChallengeVisualizationRefs & {
  adjacency: Adjacency;
  waitOnNodeClick: () => Promise<string>;
  selectedNode: string;
};
