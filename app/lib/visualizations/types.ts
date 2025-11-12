import { InitialStep } from "@/app/visualize/[visualization]/types";
import { Edge, Node } from "@/app/visualize/GraphTypes";

export type Visualization = {
  id: number;
  title: string;
  slug: string;
  code: string;
  initial_step: InitialStep;
  pseudocode: string;
  nodes: Node[];
  edges: Edge[];
  reset_code: string;
  is_node_selection_enabled: boolean;
  guide_text: string;
};

export type VisualizationNavItem = Pick<Visualization, "id" | "title" | "slug">;
