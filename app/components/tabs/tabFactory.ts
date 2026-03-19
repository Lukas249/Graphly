import { ReactNode } from "react";
import { Tab, TabTitle } from "./types";

export function createStaticTab(
  title: TabTitle,
  content: ReactNode,
  closeable = false,
): Tab {
  return {
    id: crypto.randomUUID(),
    title,
    content,
    closeable,
  };
}

export function createRenderTab(
  title: TabTitle,
  renderContent: () => ReactNode,
  closeable = false,
): Tab {
  return {
    id: crypto.randomUUID(),
    title,
    renderContent,
    closeable,
  };
}

export function createClosableTab(title: TabTitle, content: ReactNode): Tab {
  return createStaticTab(title, content, true);
}
