"use client";

import { useRef, useState } from "react";
import { Tabs } from "../../components/tabs/tabs";
import Menu from "../../menu";
import Chat from "../../components/chat/chat";
import { ChatRef, MessageDetails } from "../../components/chat/types";
import { askAI } from "../../lib/gemini-ai/ai";
import AISelectionProvider from "../../lib/AISelectionProvider";
import { Prisma } from "@/prisma/generated/client";
import { Question } from "@/app/components/quiz/quizCard";
import ArticleContent from "./article-content";
import CollapsibleVerticalMenu from "@/app/components/collapsible-vertical-menu";
import Link from "next/link";
import { sendHandler } from "@/app/components/chat/sendHandler";
import { Tab } from "@/app/components/tabs/types";
import { addChatContext } from "@/app/components/chat/context/addChatContext";

export default function Article({
  articleData,
  articles,
}: {
  articleData: Prisma.articlesModel;
  articles: { title: string; slug: string }[];
}) {
  const chatRef = useRef<ChatRef>(null);

  const [articleTabs, setArticleTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Article",
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            addChatContext(chatRef, "description", selectedText, true);
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
      content: (
        <div className="h-[calc(100vh-180px)]">
          <Chat
            ref={chatRef}
            onSend={async (message: MessageDetails) =>
              await sendHandler(chatRef, message, askAI)
            }
            background="bg-base-200"
          />
        </div>
      ),
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
