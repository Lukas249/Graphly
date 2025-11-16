"use client";

import {
  RefObject,
  SetStateAction,
  useImperativeHandle,
  useState,
} from "react";
import { Tab, TabsRef } from "./types";
import { TabsList } from "./tabsList";
import { TabsContent } from "./tabsContent";

export function Tabs({
  ref,
  initialTabs,
  className = "",
  initialTab = 0,
  tabBackground = "bg-gray-dark",
  tabListBackground = "bg-gray-dark-850",
  onChangeTab,
}: {
  ref: RefObject<TabsRef | null>;
  initialTabs: Tab[];
  initialTab?: number;
  className?: string;
  tabBackground?: string;
  tabListBackground?: string;
  onChangeTab?: (currentTab: number) => void;
}) {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [tabs, setTabs] = useState(initialTabs);

  useImperativeHandle(ref, () => {
    return {
      setCurrentTab,
      setTabs,
      currentTab,
      getTabs: () => tabs,
    };
  });

  return (
    <div className={className}>
      <TabsList
        tabs={tabs}
        setTabs={setTabs}
        setCurrentTab={(val: SetStateAction<number>) => {
          setCurrentTab((prev) => {
            const newIndex = typeof val === "function" ? val(prev) : val;
            if (onChangeTab) onChangeTab(newIndex);
            return newIndex;
          });
        }}
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
