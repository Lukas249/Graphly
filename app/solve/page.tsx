"use client";
import lodash from "lodash";
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import React, { useRef, useState } from "react";
import ProblemDescription from "./problemDescription";
import Menu from "../menu";

import { problem } from "./data";
import { Tab, Tabs } from "../components/tabs";
import Chat, { ChatRef } from "../components/chat/chat";
import { MessageDetails } from "../components/chat/types";
import getSubmissionResult from "./submitCode";
import { askAI } from "../lib/ai";
import Result, { resultType } from "./result";

import { ToastContainer, toast } from "react-toastify";
import AISelectionProvider from "../lib/AISelectionProvider";
import { BeakerIcon, CodeBracketIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

type TabSection = "main" | "code" | "testcases";

interface TabSetters {
  setTabs:  React.Dispatch<React.SetStateAction<Tab[]>>;     
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
}

export default function Solve() {
  const [mainTabsCurrentTab, setMainTabsCurrentTab] = useState(0);
  const [codeTabsCurrentTab, setCodeTabsCurrentTab] = useState(0);
  const [testcasesTabsCurrentTab, setTestcasesTabsCurrentTab] = useState(0);

  const [testcases, setTestcases] = useState(problem.testcases.join("\n"));

  const [sourceCode, setSourceCode] = useState(problem.code);

  const [codeJudging, setCodeJudging] = useState(false);

  const chatRef = useRef<ChatRef>(null);

  const [chat] = useState(
    <Chat
      ref={chatRef}
      onSend={async (messages: MessageDetails[]) => {
        const chatContexts = chatRef.current?.getContexts()

        const contexts: Record<string, string> = {}

        if(chatContexts) {
          for(const [key, value] of Object.entries(chatContexts)) {
            contexts[key] = value.text
          } 
        } 

        const answer = await askAI(messages, contexts);
        chatRef.current?.addMessage({ type: "response", msg: answer });
      }}
    />
  );

  const [mainTabs, setMainTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Description",
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            chatRef.current?.addContext("description", {icon: <DocumentTextIcon className="size-3.5 fill-transparent stroke-primary" />, text: selectedText, closeable: true})
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
      content: (
        <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            chatRef.current?.addContext("testcases", {icon: <BeakerIcon className="size-3.5 stroke-primary" />, text: selectedText, closeable: true})
          }}
        >
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          defaultValue={testcases}
          theme="vs-dark"
          onChange={(val) => val && setTestcases(val)}
          options={{
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
      content: (
         <AISelectionProvider
          buttonClickHandler={(__, selectedText) => {
            chatRef.current?.addContext("code", {icon: <CodeBracketIcon className="size-3.5 stroke-primary" />,text: selectedText, closeable: true})
          }}
        >
          <Editor
            height="100%"
            defaultLanguage="c"
            defaultValue={sourceCode}
            theme="vs-dark"
            onChange={(val) =>  val && setSourceCode(val)}
            options={{
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
        return { setTabs: setTestcasesTabs, setCurrentTab: setTestcasesTabsCurrentTab };
    }
  };

  const addTab = (tab: Tab, tabSection: TabSection) => {
    const { setTabs, setCurrentTab } = getTabSetters(tabSection)

    setTabs((tabs) => {
      const deepClone = lodash.cloneDeep(tabs);
      deepClone.push(tab);
      setCurrentTab(() => deepClone.length - 1);
      return deepClone;
    });
  };

  const handleRun = async () => {
    const result = await handleCodeRun(
      problem.header + "\n" + sourceCode + "\n" + problem.driver,
      54,
      testcases.length,
      testcases,
    );

    if(result) {
      addTab(
        {
          id: crypto.randomUUID(),
          title: resultType(result),
          content: 
              <Result result={result} sourceCode={sourceCode} />,
          closeable: true,
        },
        "testcases"
      )
    }
  };

  const handleSubmit = async () => {
    const result = handleCodeRun(
      problem.header + "\n" + sourceCode + "\n" + problem.driver,
      54,
      problem.testcases.length,
      problem.testcases.join("\n"),
    );

    const feedbackAI = askAI(
      [
        {
          type: "question",
          msg: `You are given the result of a user code submission. Write short feedback that will be displayed directly in a feedback field. Do not include introductions, titles, or bullet points. Write in plain markdown as smooth flowing text. Always state the time complexity and space complexity in a natural sentence. Only add a brief improvement suggestion if there is something meaningful to improve. If nothing needs improvement, stop after giving complexities without adding filler.`
        }
      ],
      {
        "submission": `
          Code: ${sourceCode}
        `
      }
    );

    Promise.all([
      result, 
      feedbackAI.then((answer) => answer).catch(() => "")
    ])
      .then(([result, feedbackAI]) => {
        if(!result) {
          throw new Error("Failed to submit code");
        }

        const content = feedbackAI ?
          <Result result={result} sourceCode={sourceCode} feedbackAI={feedbackAI} /> :
          <Result result={result} sourceCode={sourceCode} />

        addTab(
          {
            id: crypto.randomUUID(),
            title: resultType(result),
            content,
            closeable: true,
          },
          "main"
        )
      })
      .catch(() => {
        toast.error("Failed to submit code");
      })
  };

  const handleCodeRun = async (
    sourceCode: string,
    langId: number,
    testcasesNumber: number,
    testcases: string,
  ) => {
    setCodeJudging(true);

    return getSubmissionResult(sourceCode, langId, testcasesNumber + "\n" + testcases)
      .catch(() => {
        toast.error("Failed to submit code");
      })
      .finally(() => {
        setCodeJudging(false);
      });
  };

  return (
    <div className="mx-2 flex h-screen flex-col pb-2">
      <Menu />

      <ToastContainer theme="dark" />

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
                className="h-full flex flex-col"
                tabs={codeTabs}
                setTabs={setCodeTabs}
                setCurrentTab={setCodeTabsCurrentTab}
                currentTab={codeTabsCurrentTab}
              />
            </Allotment.Pane>

            <Allotment.Pane preferredSize="25%">
              <Tabs
                className="mt-1 h-full flex flex-col"
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
