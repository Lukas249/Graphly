import { JSX } from "react";

export type ContextTypes =
  | "testcases"
  | "description"
  | "code"
  | "graph"
  | "graph specification";

export type ContextIcons = Record<ContextTypes, JSX.Element>;
