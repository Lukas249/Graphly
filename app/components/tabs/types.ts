import { Dispatch, ReactNode, SetStateAction } from "react";

export type Tab = {
  id: string;
  title: TabTitle;
  content?: ReactNode;
  renderContent?: () => ReactNode;
  closeable: boolean;
};

export type TabsRef = {
  setCurrentTab: Dispatch<SetStateAction<number>>;
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  currentTab: number;
  getTabs: () => Tab[];
};

export enum TabTitle {
  Article = "Article",
  GraphlyAI = "Graphly AI",
  Description = "Description",
  Testcases = "Testcases",
  Code = "Code",
  Tutorial = "Tutorial",
  Guide = "Guide",
  Graph = "Graph",
  Submission = "Submission",
  Test = "Test",
}
