import { ArticleNavItem } from "@/app/lib/articles/types";
import { ProblemDifficulty, ProblemNavItem } from "@/app/lib/problems/types";
import { VisualizationNavItem } from "@/app/lib/visualizations/types";
import { JSX } from "react";

export type LinkType = "learn" | "visualize" | "solve";

export type NavItem = ArticleNavItem | ProblemNavItem | VisualizationNavItem;

export type LinkRenderer<T> = (data: T) => JSX.Element;

export type LinkTemplates = {
  learn: LinkRenderer<{ title: string }>;
  visualize: LinkRenderer<{ title: string }>;
  solve: LinkRenderer<{
    id: number;
    title: string;
    difficulty: ProblemDifficulty;
  }>;
};
