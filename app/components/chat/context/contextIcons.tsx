import {
  BeakerIcon,
  CircleStackIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";

const baseStyle = "stroke-primary size-3.5";
const styleFillTransparent = `${baseStyle} fill-transparent`;

export const defaultContextIcon = <DocumentTextIcon className={baseStyle} />;

export const contextIcons = {
  testCases: <BeakerIcon className={baseStyle} />,
  text: defaultContextIcon,
  code: <CodeBracketIcon className={baseStyle} />,
  graph: <MapIcon className={styleFillTransparent} />,
  data: <CircleStackIcon className={styleFillTransparent} />,
} satisfies Record<string, JSX.Element>;

export const contextLabels = {
  testCases: "Test Cases",
  title: "Title",
  description: "Description",
  code: "Code",
  pseudocode: "Pseudocode",
  graph: "Graph Representation",
  visualizationStepsHistory: "Visualization Steps History",
  articleContent: "Article Content",
  problemDescription: "Problem Description",
  userCustomContext: "Custom Context",
  lastJudgeResult: "Last Judge Result",
} satisfies Record<string, string>;

export function getContextType(label: string): string {
  const labelArr = label.split(" ");
  labelArr[0] = labelArr[0].toLowerCase();
  return labelArr.join("");
}
