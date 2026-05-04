import { RefObject } from "react";
import { Adjacency } from "@/app/lib/graph/types";
import { Edge, GraphHandle, Node } from "../core/graphTypes";
import { TutorialRef } from "../core/tutorial";

export type Variables = {
  node: string;
  neighbours: string[];
  path: string[];
};

export type InitialStep = {
  description: string;
  variables: Record<string, unknown>;
  buttonText: string;
};

export type VisualizationRefs = {
  graphRef: RefObject<GraphHandle | null>;
  tutorialRef: RefObject<TutorialRef<Variables> | null>;
};

export type AlgorithmParams = VisualizationRefs & {
  waitOnClick: () => Promise<unknown>;
  nodes: Node[];
  edges: Edge[];
  adjacency: Adjacency;
  selectedNode: string;
  [key: string]: unknown;
};

export type AlgorithmFunction = (params: AlgorithmParams) => Promise<unknown>;
