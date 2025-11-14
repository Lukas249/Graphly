import { Tab } from "./types";

export function TabsContent({
  tabs,
  currentTab = 0,
  tabBackground,
}: {
  tabs: Tab[];
  currentTab?: number;
  tabBackground?: string;
}) {
  return tabs.map((tab, index) => (
    <div
      key={tab.id}
      style={{ display: index === currentTab ? "block" : "none" }}
      className={`${tabBackground} h-full overflow-auto rounded-b-lg`}
    >
      {tab.renderContent ? tab.renderContent() : tab.content}
    </div>
  ));
}
