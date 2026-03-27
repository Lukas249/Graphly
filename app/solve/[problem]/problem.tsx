"use client";

import lodash from "lodash";
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ProblemDescription from "@/app/components/problemDescription/problemDescription";
import Menu from "@/app/menu";

import { Tabs } from "@/app/components/tabs/tabs";
import Chat from "@/app/components/chat/chat";
import { ChatRef, MessageDetails } from "@/app/components/chat/types";
import { askAI, getFeedbackAI } from "@/app/lib/gemini-ai/ai";

import AISelectionProvider from "@/app/components/providers/aiSelectionProvider";
import { languages } from "./languages";
import type { Problem } from "@/app/lib/problems/types";
import { sendHandler } from "@/app/components/chat/sendHandler";
import { Tab, TabsRef, TabTitle } from "@/app/components/tabs/types";
import {
  createClosableTab,
  createRenderTab,
  createStaticTab,
} from "@/app/components/tabs/tabFactory";
import { addChatContext } from "@/app/components/chat/context/addChatContext";
import { ButtonsPanel } from "./buttonsPanel";
import { onChangeTab } from "@/app/components/tabs/onChangeTab";
import {
  contextIcons,
  contextLabels,
  getContextType,
} from "@/app/components/chat/context/contextIcons";
import { useJudgeActions } from "./useJudgeActions";
import Result from "../status/result";
import { SubmissionResult } from "@/app/lib/judge0/types";

type TabSection = "main" | "code" | "testcases";

interface TabSetters {
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
}

const renderResultTabContent = (
  result: SubmissionResult,
  sourceCode: string,
  params: string[],
  feedbackAI?: string,
) => (
  <Result
    result={result}
    sourceCode={sourceCode}
    feedbackAI={feedbackAI}
    paramsNames={params}
  />
);

const monacoEditorOptions = {
  stickyScroll: {
    enabled: false,
  },
  tabSize: 2,
  detectIndentation: false,
  wordWrap: "on" as const,
  minimap: {
    enabled: false,
  },
};

export default function Problem({
  problem,
  defaultLanguage = "Python3",
}: {
  problem: Problem;
  defaultLanguage?: string;
}) {
  const [sourceCode, setSourceCode] = useState(problem.code);
  const [testcases, setTestcases] = useState(problem.testcases);

  const [codeJudging, setCodeJudging] = useState(false);

  const [language] = useState(languages[defaultLanguage]);

  const mainTabsRef = useRef<TabsRef>(null);
  const codeTabsRef = useRef<TabsRef>(null);
  const testcasesTabsRef = useRef<TabsRef>(null);

  const chatRef = useRef<ChatRef>(null);

  const debouncedAddCodeContext = useMemo(
    () =>
      lodash.debounce((value: string) => {
        addChatContext(
          chatRef,
          getContextType(contextLabels.code),
          contextLabels.code,
          value,
          false,
        );
      }, 100),
    [],
  );

  const debouncedAddTestcasesContext = useMemo(
    () =>
      lodash.debounce((value: string) => {
        addChatContext(
          chatRef,
          getContextType(contextLabels.testCases),
          contextLabels.testCases,
          value,
          false,
        );
      }, 100),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedAddCodeContext.cancel();
      debouncedAddTestcasesContext.cancel();
    };
  }, [debouncedAddCodeContext, debouncedAddTestcasesContext]);

  const chat = useMemo(
    () => (
      <Chat
        ref={chatRef}
        onSend={async (message: MessageDetails) =>
          await sendHandler(chatRef, message, askAI)
        }
        defaultContexts={{
          [getContextType(contextLabels.code)]: {
            icon: contextIcons.code,
            label: contextLabels.code,
            text: sourceCode,
            closeable: false,
          },
          [getContextType(contextLabels.testCases)]: {
            icon: contextIcons.testCases,
            label: contextLabels.testCases,
            text: testcases,
            closeable: false,
          },
          [getContextType(contextLabels.problemDescription)]: {
            icon: contextIcons.text,
            label: contextLabels.problemDescription,
            text: problem.title + "\n" + problem.description,
            closeable: false,
          },
        }}
      />
    ),
    [problem.title, problem.description, sourceCode, testcases],
  );

  const mainTabs = useMemo<Tab[]>(
    () => [
      createStaticTab(
        TabTitle.Description,
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            addChatContext(
              chatRef,
              getContextType(contextLabels.userCustomContext),
              selectedText,
              selectedText,
              true,
            );
            mainTabsRef.current?.setCurrentTabByTitle(TabTitle.GraphlyAI);
          }}
        >
          <ProblemDescription
            id={problem.id}
            title={problem.title}
            description={problem.description}
          />
        </AISelectionProvider>,
      ),
      createRenderTab(TabTitle.GraphlyAI, () => chat),
    ],
    [chat, problem.description, problem.id, problem.title],
  );

  const testcasesTabs = useMemo<Tab[]>(
    () => [
      createRenderTab(TabTitle.Testcases, () => (
        <Editor
          height="100%"
          language="plaintext"
          defaultValue={testcases}
          theme="vs-dark"
          onChange={(val) => {
            if (!val) return;
            setTestcases(val);
            debouncedAddTestcasesContext(val);
          }}
          options={monacoEditorOptions}
        />
      )),
    ],
    [debouncedAddTestcasesContext, testcases],
  );

  const codeTabs = useMemo<Tab[]>(
    () => [
      createRenderTab(TabTitle.Code, () => (
        <Editor
          height="100%"
          language={language.editorLanguage}
          defaultValue={sourceCode}
          theme="vs-dark"
          onChange={(val) => {
            if (!val) return;
            setSourceCode(val);
            debouncedAddCodeContext(val);
          }}
          options={monacoEditorOptions}
          className="mb-2"
        />
      )),
    ],
    [debouncedAddCodeContext, language.editorLanguage, sourceCode],
  );

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

  const { handleRunJudge, handleSubmitJudge } = useJudgeActions({
    problemId: problem.id,
    languageId: language.id,
    sourceCode,
    testcases,
  });

  const handleJudge = async (isSubmit: boolean, sourceCode: string) => {
    setCodeJudging(true);

    const result = isSubmit
      ? await handleSubmitJudge()
      : await handleRunJudge();

    if (!result) {
      setCodeJudging(false);
      return;
    }

    if (isSubmit) {
      let feedbackAI = "";

      if (result.status?.id === 3) {
        try {
          feedbackAI = await getFeedbackAI(sourceCode);
        } catch {}
      }

      addTab(
        createClosableTab(
          TabTitle.Submission,
          renderResultTabContent(
            result,
            sourceCode,
            problem.params,
            feedbackAI,
          ),
        ),
        "main",
      );
    } else {
      addTab(
        createClosableTab(
          TabTitle.Test,
          renderResultTabContent(result, sourceCode, problem.params),
        ),
        "testcases",
      );
    }

    addChatContext(
      chatRef,
      getContextType(contextLabels.lastJudgeResult),
      contextLabels.lastJudgeResult,
      `Judge Result: ${JSON.stringify(result)}`,
      true,
    );

    setCodeJudging(false);
  };

  return (
    <div className="mx-2 flex h-screen flex-col pb-2">
      <Menu />

      <ButtonsPanel
        isCodeJudging={codeJudging}
        handleRun={() => handleJudge(false, sourceCode)}
        handleSubmit={() => handleJudge(true, sourceCode)}
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
