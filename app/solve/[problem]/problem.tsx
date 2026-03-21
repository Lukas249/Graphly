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
import { askAI } from "@/app/lib/gemini-ai/ai";

import AISelectionProvider from "@/app/components/providers/aiSelectionProvider";
import { languages } from "./languages";
import type { Problem } from "@/app/lib/problems/types";
import { sendHandler } from "@/app/components/chat/sendHandler";
import { Tab, TabsRef, TabTitle } from "@/app/components/tabs/types";
import {
  createRenderTab,
  createStaticTab,
} from "@/app/components/tabs/tabFactory";
import { addChatContext } from "@/app/components/chat/context/addChatContext";
import { ButtonsPanel } from "./buttonsPanel";
import { onChangeTab } from "@/app/components/tabs/onChangeTab";
import { contextIcons } from "@/app/components/chat/context/contextIcons";
import { useJudgeActions } from "./useJudgeActions";

type TabSection = "main" | "code" | "testcases";

interface TabSetters {
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
}

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
  const sourceCodeRef = useRef(problem.code);
  const testcasesRef = useRef(problem.testcases);

  const [codeJudging, setCodeJudging] = useState(false);

  const [language] = useState(languages[defaultLanguage]);

  const mainTabsRef = useRef<TabsRef>(null);
  const codeTabsRef = useRef<TabsRef>(null);
  const testcasesTabsRef = useRef<TabsRef>(null);

  const chatRef = useRef<ChatRef>(null);

  const debouncedAddCodeContext = useMemo(
    () =>
      lodash.debounce((value: string) => {
        addChatContext(chatRef, "code", value, false);
      }, 250),
    [],
  );

  const debouncedAddTestcasesContext = useMemo(
    () =>
      lodash.debounce((value: string) => {
        addChatContext(chatRef, "testCases", value, false);
      }, 250),
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
          code: {
            icon: contextIcons.code,
            text: sourceCodeRef.current,
            closeable: false,
          },
          testCases: {
            icon: contextIcons.testCases,
            text: testcasesRef.current,
            closeable: false,
          },
        }}
      />
    ),
    [],
  );

  const mainTabs = useMemo<Tab[]>(
    () => [
      createStaticTab(
        TabTitle.Description,
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
          defaultValue={testcasesRef.current}
          theme="vs-dark"
          onChange={(val) => {
            if (!val) return;
            testcasesRef.current = val;
            debouncedAddTestcasesContext(val);
          }}
          options={monacoEditorOptions}
        />
      )),
    ],
    [debouncedAddTestcasesContext],
  );

  const codeTabs = useMemo<Tab[]>(
    () => [
      createRenderTab(TabTitle.Code, () => (
        <Editor
          height="100%"
          language={language.editorLanguage}
          defaultValue={sourceCodeRef.current}
          theme="vs-dark"
          onChange={(val) => {
            if (!val) return;
            sourceCodeRef.current = val;
            debouncedAddCodeContext(val);
          }}
          options={monacoEditorOptions}
          className="mb-2"
        />
      )),
    ],
    [debouncedAddCodeContext, language.editorLanguage],
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

  const { handleRun, handleSubmit } = useJudgeActions({
    problemId: problem.id,
    paramsNames: problem.params,
    languageId: language.id,
    sourceCodeRef,
    testcasesRef,
    setCodeJudging,
    addTab,
  });

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
