"use client"
import lodash from "lodash"
import Editor from "@monaco-editor/react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";
import ProblemDescription from "./problemDescription";
import Menu from "../menu";

import { problem } from "./data"
import { decodeUtf8Base64 } from "@/lib/decodeBase64";
import { Tab, Tabs } from "../components/tabs";

export default function Solve() {
  const [mainTabsCurrentTab, setMainTabsCurrentTab] = useState(0)
  const [codeTabsCurrentTab, setCodeTabsCurrentTab] = useState(0)
  const [testcasesTabsCurrentTab, setTestcasesTabsCurrentTab] = useState(0)

  const [testcases, setTestcases] = useState(problem.testcases.join("\n"));

  const [sourceCode, setSourceCode] = useState(problem.code);

  const [codeJudging, setCodeJudging] = useState(false);

  const [mainTabs, setMainTabs] = useState<Tab[]>([
      {
        id: crypto.randomUUID(),
        title: "Description", 
        content: <ProblemDescription
              id={problem.id}
              title={problem.title}
              description={problem.description}
              />,
        closeable: false
      }
  ])

  const [testcasesTabs, setTestcasesTabs] = useState<Tab[]>([
      {
        id: crypto.randomUUID(),
        title: "Testcases", 
        content: <Editor
            height="100%"
            defaultLanguage="plaintext"
            defaultValue={testcases}
            theme="vs-dark"
            onChange={(val) => val && setTestcases(val)}
            options={{
              minimap: {
                enabled: false
              }
            }}
          />,
        closeable: false
      },
  ])

  const [codeTabs, setCodeTabs] = useState<Tab[]>([
      {
        id: crypto.randomUUID(),
        title: "Code", 
        content: 
          <Editor
              height="100%"
              defaultLanguage="c"
              defaultValue={sourceCode}
              theme="vs-dark"
              onChange={(val) => val && setSourceCode(val)}
              options={{
                minimap: {
                  enabled: false
                }
              }}
              className="mb-2"
            />,
        closeable: false
      },
  ])

  const handleRun = () => {
    setMainTabs((tabs) => {
                  const deepClone = lodash.cloneDeep(tabs)
                  deepClone.push({id: crypto.randomUUID(), title: "Result", content: "1", closeable: true})
                  return deepClone
                }) 
  };
  const getSubmissionResult = async (sourceCode: string, languageId: number, testcases: string, expectedOutputs: string) => {
    setCodeJudging(true)
    
    let intervalId: NodeJS.Timeout, timeoutId: NodeJS.Timeout;

    const cleanup = () => {
          if (intervalId !== undefined) clearInterval(intervalId);
          if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
    
    const fetchData = await fetch("http://localhost:2358/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: testcases,
        expected_output: expectedOutputs,
        base64_encoded: true,
        callback_url: "http://localhost:3000"
      })
    })

    const data = await fetchData.json()
    
    const token = data.token;

    timeoutId = setTimeout(() => {
      cleanup()
    }, 60_000)

    intervalId = setInterval(() => {
        fetch(`http://localhost:2358/submissions/${token}?base64_encoded=true`)
          .then(res => {
            return res.json()
          })
          .then(result => {
            if (result && result.status && result.status.id <= 2) {
              console.log("Czekam...");
              return;
            }
            cleanup()
            console.log("OUTPUT:", decodeUtf8Base64(result?.stdout?.trim()));
            console.log("STATUS:", result?.status?.description);
            console.log(result)

            setMainTabs((tabs) => {
              const deepClone = lodash.cloneDeep(tabs)
              deepClone.push(
                {
                  id: crypto.randomUUID(), 
                  title: "Result", 
                  content: <>
                    <p className="text-green-400">{result?.status?.description}</p>
                    <p>TIME: {result?.time * 1000} ms</p>
                    <p>MEMORY: {result?.memory} KB</p>
                    <p>Testcases: {problem.testcases.length}</p>
                  </>, 
                  closeable: true})
              setMainTabsCurrentTab(() => deepClone.length - 1)
              return deepClone
            }) 

            setCodeJudging(false)

            console.log(decodeUtf8Base64(result.compile_output))
          })
          .catch((err) => {
            console.log(err)
            cleanup()
          })
    }, 1000);
  }
  const handleSubmit = async () => {
    getSubmissionResult(sourceCode + "\n" + problem.driver, 54, problem.testcases.length + "\n" + problem.testcases.join("\n"), problem.outputs.join("\n"))
  };
 
    return (
      <div className="h-screen flex flex-col mx-2 pb-2">
        <Menu />
        
        {
          codeJudging ? 
          (
            <button className="btn flex flex-row gap-2 justify-center m-2 h-7.5 w-fit mx-auto" disabled>
              <span className="loading loading-spinner loading-xs"></span>
              Processing...
            </button>
          ) : (
            <div className="flex flex-row gap-5 justify-center p-2">
              <button onClick={handleRun} className="btn-gray !h-7.5">Run</button>
              <button onClick={handleSubmit} className="btn h-7.5">Submit</button>
            </div>
          )
        }

        <div className="h-full">
          <Allotment className="rounded-t-lg" separator={false}>
            <Tabs 
              className="h-full mr-0.5" 
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
                  className="h-full mt-1"
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
    )
}