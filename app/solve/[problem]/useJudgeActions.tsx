import { toast } from "react-toastify";
import { RefObject } from "react";
import Result from "../status/result";
import { SubmissionResult } from "@/app/lib/judge0/types";
import { handleCodeRun, handleCodeSubmit } from "@/app/lib/judge0/codeJudge";
import { getFeedbackAI } from "@/app/lib/gemini-ai/ai";
import { Tab, TabTitle } from "@/app/components/tabs/types";
import { createClosableTab } from "@/app/components/tabs/tabFactory";

type JudgeTabSection = "main" | "testcases";

type UseJudgeActionsParams = {
  problemId: number;
  paramsNames: string[];
  languageId: number;
  sourceCodeRef: RefObject<string>;
  testcasesRef: RefObject<string>;
  setCodeJudging: (isJudging: boolean) => void;
  addTab: (tab: Tab, tabSection: JudgeTabSection) => void;
};

export function useJudgeActions({
  problemId,
  paramsNames,
  languageId,
  sourceCodeRef,
  testcasesRef,
  setCodeJudging,
  addTab,
}: UseJudgeActionsParams) {
  const renderResultTabContent = (
    result: SubmissionResult,
    sourceCode: string,
    feedbackAI?: string,
  ) => (
    <Result
      result={result}
      sourceCode={sourceCode}
      feedbackAI={feedbackAI}
      paramsNames={paramsNames}
    />
  );

  const handleRun = async () => {
    setCodeJudging(true);

    try {
      const currentSourceCode = sourceCodeRef.current ?? "";
      const currentTestcases = testcasesRef.current ?? "";

      const result: SubmissionResult | null = await handleCodeRun(
        problemId,
        currentSourceCode,
        languageId,
        currentTestcases,
      );

      if (!result) {
        toast.error("Failed to run code");
        return;
      }

      addTab(
        createClosableTab(
          TabTitle.Test,
          renderResultTabContent(result, currentSourceCode),
        ),
        "testcases",
      );
    } finally {
      setCodeJudging(false);
    }
  };

  const handleSubmit = async () => {
    setCodeJudging(true);

    try {
      const currentSourceCode = sourceCodeRef.current ?? "";

      const result: SubmissionResult | null = await handleCodeSubmit(
        problemId,
        currentSourceCode,
        languageId,
      );

      if (!result) {
        toast.error("Failed to submit code");
        return;
      }

      let feedbackAI = "";

      if (result.status?.id === 3) {
        try {
          feedbackAI = await getFeedbackAI({
            code: `<CODE_START>${currentSourceCode}</CODE_END>`,
          });
        } catch {
          feedbackAI = "";
        }
      }

      addTab(
        createClosableTab(
          TabTitle.Submission,
          renderResultTabContent(result, currentSourceCode, feedbackAI),
        ),
        "main",
      );
    } finally {
      setCodeJudging(false);
    }
  };

  return {
    handleRun,
    handleSubmit,
  };
}
