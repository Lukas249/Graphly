import { RefObject } from "react";
import { Edge, GraphHandle, Node } from "../GraphTypes";
import { TutorialRef } from "../Tutorial";

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

export type NodeDetails = {
  nodeId: string;
  weight: string;
};

export type Adjacency = {
  [key: string]: NodeDetails[];
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
