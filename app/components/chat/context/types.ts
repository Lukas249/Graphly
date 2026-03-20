import { JSX } from "react";

export type ContextTypes =
  | "testCases"
  | "title"
  | "description"
  | "code"
  | "graph"
  | "graphSpecification"
  | "visualizationStepHistory";

export type ContextIcons = Record<ContextTypes, JSX.Element>;
