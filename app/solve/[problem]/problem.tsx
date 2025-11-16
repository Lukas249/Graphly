"use client";

import lodash from "lodash";
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import React, { useRef, useState } from "react";
import ProblemDescription from "../../components/problemDescription/problemDescription";
import Menu from "../../menu";

import { Tabs } from "../../components/tabs/tabs";
import Chat from "../../components/chat/chat";
import { ChatRef, MessageDetails } from "../../components/chat/types";
import { askAI, getFeedbackAI } from "../../lib/gemini-ai/ai";
import Result from "../status/result";

import { toast } from "react-toastify";
import AISelectionProvider from "../../lib/AISelectionProvider";
import { languages } from "./languages";
import type { Problem } from "@/app/lib/problems/types";
import { SubmissionResult } from "@/app/lib/judge0/types";
import { sendHandler } from "@/app/components/chat/sendHandler";
import { Tab, TabsRef, TabTitle } from "@/app/components/tabs/types";
import { addChatContext } from "@/app/components/chat/context/addChatContext";
import { handleCodeRun, handleCodeSubmit } from "@/app/lib/judge0/codeJudge";
import { ButtonsPanel } from "./buttonsPanel";
import { onChangeTab } from "@/app/lib/tabs/onChangeTab";

type TabSection = "main" | "code" | "testcases";

interface TabSetters {
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function Problem({
  problem,
  defaultLanguage = "Python3",
}: {
  problem: Problem;
  defaultLanguage?: string;
}) {
  const [testcases, setTestcases] = useState(problem.testcases);

  const [sourceCode, setSourceCode] = useState(problem.code);

  const [codeJudging, setCodeJudging] = useState(false);

  const [language] = useState(languages[defaultLanguage]);

  const mainTabsRef = useRef<TabsRef>(null);
  const codeTabsRef = useRef<TabsRef>(null);
  const testcasesTabsRef = useRef<TabsRef>(null);

  const chatRef = useRef<ChatRef>(null);

  const [chat] = useState(
    <Chat
      ref={chatRef}
      onSend={async (message: MessageDetails) =>
        await sendHandler(chatRef, message, askAI)
      }
    />,
  );

  const [mainTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: TabTitle.Description,
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            addChatContext(chatRef, "description", selectedText, true);
          }}
        >
          <ProblemDescription
            id={problem.id}
            title={problem.title}
            description={problem.description}
          />
        </AISelectionProvider>
      ),
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: TabTitle.GraphlyAI,
      renderContent: () => chat,
      closeable: false,
    },
  ]);

  const [testcasesTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: TabTitle.Testcases,
      renderContent: () => (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            addChatContext(chatRef, "testcases", selectedText, true);
          }}
        >
          <Editor
            height="100%"
            language="plaintext"
            value={testcases}
            theme="vs-dark"
            onChange={(val) => val && setTestcases(val)}
            options={{
              stickyScroll: {
                enabled: false,
              },
              tabSize: 2,
              detectIndentation: false,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
          />
        </AISelectionProvider>
      ),
      closeable: false,
    },
  ]);

  const [codeTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: TabTitle.Code,
      renderContent: () => (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            addChatContext(chatRef, "code", selectedText, true);
          }}
        >
          <Editor
            height="100%"
            language={language.editorLanguage}
            value={sourceCode}
            theme="vs-dark"
            onChange={(val) => val && setSourceCode(val)}
            options={{
              stickyScroll: {
                enabled: false,
              },
              tabSize: 2,
              detectIndentation: false,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
            className="mb-2"
          />
        </AISelectionProvider>
      ),
      closeable: false,
    },
  ]);

  const getTabSetters = (section: TabSection): TabSetters => {
    switch (section) {
      case "main":
        return {
          setTabs: mainTabsRef.current!.setTabs,
          setCurrentTab: mainTabsRef.current!.setCurrentTab,
        };
      case "code":
        return {
          setTabs: codeTabsRef.current!.setTabs,
          setCurrentTab: codeTabsRef.current!.setCurrentTab,
        };
      case "testcases":
        return {
          setTabs: testcasesTabsRef.current!.setTabs,
          setCurrentTab: testcasesTabsRef.current!.setCurrentTab,
        };
    }
  };

  const addTab = (tab: Tab, tabSection: TabSection) => {
    const { setTabs, setCurrentTab } = getTabSetters(tabSection);

    setTabs((tabs) => {
      const deepClone = lodash.cloneDeep(tabs);
      deepClone.push(tab);
      setCurrentTab(() => deepClone.length - 1);
      return deepClone;
    });
  };

  const handleRun = async () => {
    setCodeJudging(true);

    const result = await handleCodeRun(
      problem.id,
      sourceCode,
      language.id,
      testcases,
    );

    if (result) {
      addTab(
        {
          id: crypto.randomUUID(),
          title: TabTitle.Test,
          content: (
            <Result
              result={result}
              paramsNames={problem.params}
              sourceCode={sourceCode}
            />
          ),
          closeable: true,
        },
        "testcases",
      );
    }

    setCodeJudging(false);
  };

  const handleSubmit = async () => {
    setCodeJudging(true);

    const result: SubmissionResult | null = await handleCodeSubmit(
      problem.id,
      sourceCode,
      language.id,
    );

    if (!result) {
      toast.error("Failed to submit code");
      setCodeJudging(false);
      return;
    }

    let content;

    if (result.status && result.status.id === 3) {
      let feedbackAI = "";

      try {
        feedbackAI = await getFeedbackAI(
          { code: `Submission: ${sourceCode}` },
          "feedback-chat",
        );
      } catch {
        feedbackAI = "";
      }

      content = feedbackAI ? (
        <Result
          result={result}
          sourceCode={sourceCode}
          feedbackAI={feedbackAI}
          paramsNames={problem.params}
        />
      ) : (
        <Result
          result={result}
          sourceCode={sourceCode}
          paramsNames={problem.params}
        />
      );
    } else {
      content = (
        <Result
          result={result}
          sourceCode={sourceCode}
          paramsNames={problem.params}
        />
      );
    }

    addTab(
      {
        id: crypto.randomUUID(),
        title: TabTitle.Submission,
        content,
        closeable: true,
      },
      "main",
    );

    setCodeJudging(false);
  };

  return (
    <div className="mx-2 flex h-screen flex-col pb-2">
      <Menu />

      <ButtonsPanel
        isCodeJudging={codeJudging}
        handleRun={handleRun}
        handleSubmit={handleSubmit}
      />

      <div className="h-full">
        <Allotment className="rounded-t-lg" separator={false}>
          <Tabs
            ref={mainTabsRef}
            className="mr-0.5 flex h-full flex-col"
            initialTabs={mainTabs}
            onChangeTab={(currentTab) => {
              const tabs = mainTabsRef.current?.getTabs();
              if (tabs) onChangeTab(chatRef, tabs[currentTab]);
            }}
          />

          <Allotment className="ml-0.5" vertical={true} separator={false}>
            <Allotment.Pane preferredSize="75%">
              <Tabs
                ref={codeTabsRef}
                className="flex h-full flex-col"
                initialTabs={codeTabs}
              />
            </Allotment.Pane>

            <Allotment.Pane preferredSize="25%">
              <Tabs
                ref={testcasesTabsRef}
                className="mt-1 flex h-full flex-col"
                initialTabs={testcasesTabs}
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment>
      </div>
    </div>
  );
}
