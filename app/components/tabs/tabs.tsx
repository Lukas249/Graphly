"use client";

import { Dispatch, SetStateAction } from "react";
import { Tab } from "./types";
import { TabsList } from "./tabsList";
import { TabsContent } from "./tabsContent";

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
      <TabsList
        tabs={tabs}
        setTabs={setTabs}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        tabListBackground={tabListBackground}
      />
      <TabsContent
        tabs={tabs}
        currentTab={currentTab}
        tabBackground={tabBackground}
      />
    </div>
  );
}
