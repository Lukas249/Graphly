import { Dispatch, SetStateAction } from "react";
import { Tab } from "./types";
import TabCard from "./tab";

export function TabsList({
  tabs,
  setTabs,
  setCurrentTab,
  currentTab = 0,
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
  );
}
