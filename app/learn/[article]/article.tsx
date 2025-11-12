"use client";

import { useRef, useState } from "react";
import { Tab, Tabs } from "../../components/tabs";
import Menu from "../../menu";
import Chat, { ChatRef } from "../../components/chat/chat";
import { MessageDetails } from "../../components/chat/types";
import { askAI } from "../../lib/ai";
import AISelectionProvider from "../../lib/AISelectionProvider";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Prisma } from "@/prisma/generated/client";
import { Question } from "@/app/components/quiz/quiz-card";
import ArticleContent from "./article-content";
import CollapsibleVerticalMenu from "@/app/components/collapsible-vertical-menu";
import Link from "next/link";

export default function Article({
  articleData,
  articles,
}: {
  articleData: Prisma.articlesModel;
  articles: { title: string; slug: string }[];
}) {
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
          <ArticleContent
            title={articleData.title}
            article={articleData.article}
            quizData={articleData.quiz as Question[]}
          />
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
        <div className="sticky top-3 self-start">
          <CollapsibleVerticalMenu>
            {articles.map((article) => {
              return (
                <li key={article.slug}>
                  <Link href={"/learn/" + article.slug} prefetch={false}>
                    {article.title}
                  </Link>
                </li>
              );
            })}
          </CollapsibleVerticalMenu>
        </div>

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
