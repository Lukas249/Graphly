import { toast } from "react-toastify";
import { SubmissionResult } from "@/app/lib/judge0/types";
import { handleCodeRun, handleCodeSubmit } from "@/app/lib/judge0/codeJudge";

type UseJudgeActionsParams = {
  problemId: number;
  languageId: number;
  sourceCode: string;
  testcases: string;
};

export function useJudgeActions({
  problemId,
  languageId,
  sourceCode,
  testcases,
}: UseJudgeActionsParams) {
  const handleRunJudge: () => Promise<SubmissionResult | null> = async () => {
    try {
      const result: SubmissionResult | null = await handleCodeRun(
        problemId,
        sourceCode,
        languageId,
        testcases,
      );

      if (!result) {
        toast.error("Failed to run code");
        return null;
      }

      return result;
    } catch (e) {
      toast.error("Failed to run code");
      console.error(e);
      return null;
    }
  };

  const handleSubmitJudge: () => Promise<SubmissionResult | null> =
    async () => {
      try {
        const result: SubmissionResult | null = await handleCodeSubmit(
          problemId,
          sourceCode,
          languageId,
        );

        if (!result) {
          toast.error("Failed to submit code");
          return null;
        }

        return result;
      } catch (e) {
        toast.error("Failed to submit code");
        console.error(e);
        return null;
      }
    };

  return {
    handleRunJudge,
    handleSubmitJudge,
  };
}
