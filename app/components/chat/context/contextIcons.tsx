import {
  BeakerIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";
import { ContextTypes } from "./types";

export const contextIcons: Record<ContextTypes, JSX.Element> = {
  testcases: <BeakerIcon className="stroke-primary size-3.5" />,
  description: (
    <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
  code: <CodeBracketIcon className="stroke-primary size-3.5" />,
  graph: <MapIcon className="stroke-primary size-3.5 fill-transparent" />,
  "graph specification": (
    <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
};
