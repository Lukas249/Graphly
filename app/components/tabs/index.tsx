"use client";

import { ReactNode, Dispatch, SetStateAction } from "react";
import TabCard from "./tab";

export type Tab = {
  id: string;
  title: string;
  content: ReactNode;
  closeable: boolean;
};

export function Tabs({
  tabs,
  setTabs,
  setCurrentTab,
  className = "",
  currentTab = 0,
}: {
  tabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  className?: string;
  currentTab?: number;
}) {
  return (
    <div className={className}>
      <div className="bg-gray-dark-850 flex flex-row items-center gap-3 rounded-t-lg p-1.5">
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
      <div className="bg-gray-dark h-full overflow-auto rounded-b-lg">
        {currentTab >= 0 && currentTab < tabs.length
          ? tabs[currentTab].content
          : ""}
      </div>
    </div>
  );
}
