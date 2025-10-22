"use client";

import { useRef, useState } from "react";
import { Tab, Tabs } from "../components/tabs";
import Menu from "../menu";
import LearnCollapsibleVerticalMenu from "./collapsible-vertical-menu";
import ArticleDFS from "./dfs/article";
import Chat, { ChatRef } from "../components/chat/chat";
import { MessageDetails } from "../components/chat/types";
import { askAI } from "../lib/ai";
import AISelectionProvider from "../lib/AISelectionProvider";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

function Step({ step }: { step: number }) {
  return (
    <span className="bg-primary absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-sm text-lg font-bold text-white">
      {step}
    </span>
  );
}

export function VisualizationImageWithStep({
  image,
  step,
}: {
  image: React.ReactNode;
  step: number;
}) {
  return (
    <div className="relative">
      {image}
      <Step step={step} />
    </div>
  );
}

export function ArticleParagraph({ children }: { children: React.ReactNode }) {
  return <div className="my-4">{children}</div>;
}

export default function Learn() {
  const chatRef = useRef<ChatRef>(null);

  const [chat] = useState(
    <Chat
      ref={chatRef}
      onSend={async (messages: MessageDetails[]) => {
        const chatContexts = chatRef.current?.getContexts();

        const contexts: Record<string, string> = {};

        if (chatContexts) {
          for (const [key, value] of Object.entries(chatContexts)) {
            contexts[key] = value.text;
          }
        }

        const answer = await askAI(messages, contexts);
        chatRef.current?.addMessage({ type: "response", msg: answer });
      }}
      background="bg-base-200"
    />,
  );

  const [articleTabs, setArticleTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Article",
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            chatRef.current?.addContext("description", {
              icon: (
                <DocumentTextIcon className="stroke-primary size-3.5 fill-transparent" />
              ),
              text: selectedText,
              closeable: true,
            });
          }}
        >
          <ArticleDFS />
        </AISelectionProvider>
      ),
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: "Graphly AI",
      content: <div className="h-[calc(100vh-180px)]">{chat}</div>,
      closeable: false,
    },
  ]);
  const [articleTabsCurrentTab, setArticleTabsCurrentTab] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Menu />

      <div className="max-w-article my-8 flex max-h-full w-full flex-grow flex-row gap-5">
        <LearnCollapsibleVerticalMenu />
        <div className="bg-base-200 h-min w-full rounded-lg">
          <Tabs
            className="flex h-full flex-col"
            tabs={articleTabs}
            setTabs={setArticleTabs}
            setCurrentTab={setArticleTabsCurrentTab}
            currentTab={articleTabsCurrentTab}
            tabBackground="bg-base-200"
            tabListBackground="bg-base-100"
          />
        </div>
      </div>
    </div>
  );
}
