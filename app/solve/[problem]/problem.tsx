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
import Result, { resultType } from "../status/result";

import { toast } from "react-toastify";
import AISelectionProvider from "../../lib/AISelectionProvider";
import { languages } from "./languages";
import type { Problem } from "@/app/lib/problems/types";
import { SubmissionResult } from "@/app/lib/judge0/types";
import { sendHandler } from "@/app/components/chat/sendHandler";
import { Tab } from "@/app/components/tabs/types";
import { addChatContext } from "@/app/components/chat/context/addChatContext";

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
  const [mainTabsCurrentTab, setMainTabsCurrentTab] = useState(0);
  const [codeTabsCurrentTab, setCodeTabsCurrentTab] = useState(0);
  const [testcasesTabsCurrentTab, setTestcasesTabsCurrentTab] = useState(0);

  const [testcases, setTestcases] = useState(problem.testcases);

  const [sourceCode, setSourceCode] = useState(problem.code);

  const [codeJudging, setCodeJudging] = useState(false);

  const [language] = useState(languages[defaultLanguage]);

  const chatRef = useRef<ChatRef>(null);

  const [chat] = useState(
    <Chat
      ref={chatRef}
      onSend={async (message: MessageDetails) =>
        await sendHandler(chatRef, message, askAI)
      }
    />,
  );

  const [mainTabs, setMainTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Description",
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
      title: "GraphlyAI",
      content: chat,
      closeable: false,
    },
  ]);

  const [testcasesTabs, setTestcasesTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Testcases",
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

  const [codeTabs, setCodeTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Code",
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
        return { setTabs: setMainTabs, setCurrentTab: setMainTabsCurrentTab };
      case "code":
        return { setTabs: setCodeTabs, setCurrentTab: setCodeTabsCurrentTab };
      case "testcases":
        return {
          setTabs: setTestcasesTabs,
          setCurrentTab: setTestcasesTabsCurrentTab,
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
          title: resultType(result),
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

    const result: SubmissionResult = await handleCodeSubmit(
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
        feedbackAI = await getFeedbackAI({
          code: `Submission: ${sourceCode}`,
        });
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
        title: resultType(result),
        content,
        closeable: true,
      },
      "main",
    );

    setCodeJudging(false);
  };

  const handleCodeJudge = async (url: string, body: string) => {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to submit code");
          return null;
        }

        return res.json();
      })
      .catch(() => {
        toast.error("Failed to submit code");
      });
  };

  const handleCodeSubmit = async (
    problemID: number,
    sourceCode: string,
    langId: number,
  ) => {
    return handleCodeJudge(
      "/api/judge0/submit",
      JSON.stringify({
        problemID,
        sourceCode,
        languageId: langId,
      }),
    );
  };

  const handleCodeRun = async (
    problemID: number,
    sourceCode: string,
    langId: number,
    testcases: string,
  ) => {
    return handleCodeJudge(
      "/api/judge0/run",
      JSON.stringify({
        problemID,
        sourceCode,
        languageId: langId,
        testcases,
      }),
    );
  };

  return (
    <div className="mx-2 flex h-screen flex-col pb-2">
      <Menu />

      {codeJudging ? (
        <button
          className="btn m-2 mx-auto flex w-fit flex-row justify-center gap-2"
          disabled
        >
          <span className="loading loading-spinner loading-xs"></span>
          Processing...
        </button>
      ) : (
        <div className="flex flex-row justify-center gap-5 p-2">
          <button onClick={handleRun} className="btn-gray">
            Run
          </button>
          <button onClick={handleSubmit} className="btn">
            Submit
          </button>
        </div>
      )}

      <div className="h-full">
        <Allotment className="rounded-t-lg" separator={false}>
          <Tabs
            className="mr-0.5 flex h-full flex-col"
            tabs={mainTabs}
            setTabs={setMainTabs}
            setCurrentTab={setMainTabsCurrentTab}
            currentTab={mainTabsCurrentTab}
          />

          <Allotment className="ml-0.5" vertical={true} separator={false}>
            <Allotment.Pane preferredSize="75%">
              <Tabs
                className="flex h-full flex-col"
                tabs={codeTabs}
                setTabs={setCodeTabs}
                setCurrentTab={setCodeTabsCurrentTab}
                currentTab={codeTabsCurrentTab}
              />
            </Allotment.Pane>

            <Allotment.Pane preferredSize="25%">
              <Tabs
                className="mt-1 flex h-full flex-col"
                tabs={testcasesTabs}
                setTabs={setTestcasesTabs}
                setCurrentTab={setTestcasesTabsCurrentTab}
                currentTab={testcasesTabsCurrentTab}
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment>
      </div>
    </div>
  );
}
