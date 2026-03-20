import {
  BeakerIcon,
  CircleStackIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";
import { ContextTypes } from "./types";

export const contextIcons: Record<ContextTypes, JSX.Element> = {
  testCases: <BeakerIcon className="stroke-primary size-3.5" />,
  title: (
    <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
  description: (
    <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
  code: <CodeBracketIcon className="stroke-primary size-3.5" />,
  graph: <MapIcon className="stroke-primary size-3.5 fill-transparent" />,
  graphSpecification: (
    <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
  visualizationStepHistory: (
    <CircleStackIcon className="stroke-primary size-3.5 fill-transparent" />
  ),
};
