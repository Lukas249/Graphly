"use client";

import { ReactNode, Dispatch, SetStateAction } from "react";
import TabCard from "./tab";

export type Tab = {
  id: string;
  title: string;
  content?: ReactNode;
  renderContent?: () => ReactNode;
  closeable: boolean;
};

export function Tabs({
  tabs,
  setTabs,
  setCurrentTab,
  className = "",
  currentTab = 0,
  tabBackground = "bg-gray-dark",
  tabListBackground = "bg-gray-dark-850",
}: {
  tabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  className?: string;
  currentTab?: number;
  tabBackground?: string;
  tabListBackground?: string;
}) {
  return (
    <div className={className}>
      <div
        className={`${tabListBackground} flex flex-row items-center gap-3 rounded-t-lg p-1.5`}
      >
        <div className="flex gap-3 overflow-hidden">
          {tabs.map((tab, index) => (
            <TabCard
              key={tab.id}
              tab={tab}
              index={index}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setTabs={setTabs}
            ></TabCard>
          ))}
        </div>
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          style={{ display: index === currentTab ? "block" : "none" }}
          className={`${tabBackground} h-full overflow-auto rounded-b-lg`}
        >
          {tab.renderContent ? tab.renderContent() : tab.content}
        </div>
      ))}
    </div>
  );
}
