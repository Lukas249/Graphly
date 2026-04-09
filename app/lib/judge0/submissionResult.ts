import { SubmissionResult } from "./types";
import { AppError } from "@/app/lib/errors/appError";

const POLL_INTERVAL_MS = 2_000;
const MAX_WAIT_MS = 45_000;
const DEFAULT_SUBMISSION_FIELDS =
  "stdout,time,memory,stderr,token,compile_output,message,status";

export default async function getSubmissionResult(
  sourceCode: string,
  languageId: number,
  testcases: string,
  timeLimit: number,
): Promise<SubmissionResult> {
  const fetchData = await fetch(
    `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: testcases,
        base64_encoded: true,
        time: timeLimit,
      }),
    },
  );

  if (!fetchData.ok) {
    throw new AppError("Failed to create Judge0 submission", 502);
  }

  const data = await fetchData.json();

  const token = data.token;

  if (!token) {
    throw new AppError("Judge0 response missing token", 502);
  }

  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (Date.now() - startedAt > MAX_WAIT_MS) {
        clearInterval(intervalId);
        reject(new AppError("Judge0 polling timeout", 504));
        return;
      }

      fetch(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=${DEFAULT_SUBMISSION_FIELDS}`,
      )
        .then((res) => {
          if (!res.ok) {
            throw new AppError("Failed to fetch Judge0 submission status", 502);
          }

          return res.json();
        })
        .then((result) => {
          if (result && result.status && result.status.id <= 2) {
            return;
          }

          const normalizedResult: SubmissionResult = {
            ...result,
            time: Number.isFinite(Number(result.time))
              ? Number(result.time)
              : 0,
            memory: Number.isFinite(Number(result.memory))
              ? Number(result.memory)
              : 0,
          };

          clearInterval(intervalId);
          resolve(normalizedResult);
        })
        .catch((err) => {
          clearInterval(intervalId);
          reject(err);
        });
    }, POLL_INTERVAL_MS);
  });
}
