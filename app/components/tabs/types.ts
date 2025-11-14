import { ReactNode } from "react";

export type Tab = {
  id: string;
  title: string;
  content?: ReactNode;
  renderContent?: () => ReactNode;
  closeable: boolean;
};
