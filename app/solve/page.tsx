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
import getSubmissionResult, { SubmissionResult } from "./submitCode";
import { askAI } from "../lib/ai";
import Result, { resultType } from "./result";

import { ToastContainer, toast } from "react-toastify";

export default function Solve() {
  const [mainTabsCurrentTab, setMainTabsCurrentTab] = useState(0);
  const [codeTabsCurrentTab, setCodeTabsCurrentTab] = useState(0);
  const [testcasesTabsCurrentTab, setTestcasesTabsCurrentTab] = useState(0);

  const [testcases, setTestcases] = useState(problem.testcases.join("\n"));

  const [sourceCode, setSourceCode] = useState(problem.code);

  const [codeJudging, setCodeJudging] = useState(false);

  const chatRef = useRef<ChatRef>(null);
  const chat = (
    <Chat
      ref={chatRef}
      placeholder="ASK AI"
      onSend={async (messageDetails: MessageDetails) => {
        const answer = await askAI(messageDetails.msg);
        chatRef.current?.addMessage({ type: "response", msg: answer });
      }}
    />
  );

  const [mainTabs, setMainTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Description",
      content: (
        <ProblemDescription
          id={problem.id}
          title={problem.title}
          description={problem.description}
        />
      ),
      closeable: false,
    },
    {
      id: crypto.randomUUID(),
      title: "AI Assistant",
      content: chat,
      closeable: false,
    },
  ]);

  const [testcasesTabs, setTestcasesTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Testcases",
      content: (
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
      ),
      closeable: false,
    },
  ]);

  const [codeTabs, setCodeTabs] = useState<Tab[]>([
    {
      id: crypto.randomUUID(),
      title: "Code",
      content: (
        <Editor
          height="100%"
          defaultLanguage="c"
          defaultValue={sourceCode}
          theme="vs-dark"
          onChange={(val) => val && setSourceCode(val)}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          className="mb-2"
        />
      ),
      closeable: false,
    },
  ]);

  const addResultTab = (result: SubmissionResult) => {
    setMainTabs((tabs) => {
      const deepClone = lodash.cloneDeep(tabs);
      deepClone.push({
        id: crypto.randomUUID(),
        title: resultType(result),
        content: <Result result={result} sourceCode={sourceCode} />,
        closeable: true,
      });

      setMainTabsCurrentTab(() => deepClone.length - 1);
      return deepClone;
    });
  };

  const handleRun = async () => {
    await handleCodeRun(
      problem.header + "\n" + sourceCode + "\n" + problem.driver,
      54,
      testcases.length,
      testcases,
    );
  };

  const handleSubmit = async () => {
    await handleCodeRun(
      problem.header + "\n" + sourceCode + "\n" + problem.driver,
      54,
      problem.testcases.length,
      problem.testcases.join("\n"),
    );
  };

  const handleCodeRun = async (
    sourceCode: string,
    langId: number,
    testcasesNumber: number,
    testcases: string,
  ) => {
    setCodeJudging(true);
    getSubmissionResult(sourceCode, langId, testcasesNumber + "\n" + testcases)
      .then((result) => {
        addResultTab(result);
      })
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
                className="h-full"
                tabs={codeTabs}
                setTabs={setCodeTabs}
                setCurrentTab={setCodeTabsCurrentTab}
                currentTab={codeTabsCurrentTab}
              />
            </Allotment.Pane>

            <Allotment.Pane preferredSize="25%">
              <Tabs
                className="mt-1 h-full"
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
