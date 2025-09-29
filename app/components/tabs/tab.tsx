"use client";

import { Dispatch, SetStateAction } from "react";
import lodash from "lodash";
import XMarkIcon from "@/app/icons/x-mark";

import { Tab } from ".";

export default function TabCard({
  tab,
  currentTab,
  index,
  setTabs,
  setCurrentTab,
}: {
  tab: Tab;
  currentTab: number;
  index: number;
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  setCurrentTab: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className="bg-gray-dark-850 flex flex-none cursor-pointer flex-row items-center gap-1 rounded-sm px-2 py-1 hover:bg-[rgba(255,255,255,0.1)]"
      onClick={() => {
        setCurrentTab(index);
      }}
    >
      <span
        className={
          "pt-[1.1px] text-sm " +
          (currentTab === index ? "text-white" : "text-gray")
        }
      >
        {tab.title}
      </span>
      {tab.closeable && (
        <div
          className="text-xs text-gray-400 hover:bg-[rgba(0,0,0,0.05)]"
          onClick={(e) => {
            e.stopPropagation();

            setTabs((tabs) => {
              const deepCopy = lodash.cloneDeep(tabs);
              deepCopy.splice(index, 1);

              setCurrentTab((currentTab) =>
                Math.min(currentTab, deepCopy.length - 1),
              );

              return deepCopy;
            });
          }}
        >
          <XMarkIcon className="size-4" />
        </div>
      )}
    </div>
  );
}
