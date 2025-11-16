import { toast } from "react-toastify";
import { SubmissionResult } from "./types";

export async function handleCodeJudgeResponse(
  response: Promise<Response>,
): Promise<SubmissionResult | null> {
  try {
    const res = await response;

    if (!res.ok) {
      toast.error("Failed to submit code");
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit code");
  }

  return null;
}

export async function handleCodeSubmit(
  problemID: number,
  sourceCode: string,
  langId: number,
): Promise<SubmissionResult | null> {
  return await handleCodeJudgeResponse(
    fetch("/api/judge0/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemID,
        sourceCode,
        languageId: langId,
      }),
    }),
  );
}

export async function handleCodeRun(
  problemID: number,
  sourceCode: string,
  langId: number,
  testcases: string,
): Promise<SubmissionResult | null> {
  return await handleCodeJudgeResponse(
    fetch("/api/judge0/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemID,
        sourceCode,
        languageId: langId,
        testcases,
      }),
    }),
  );
}
