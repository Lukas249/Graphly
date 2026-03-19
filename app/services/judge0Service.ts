import "server-only";

import { JsonArray } from "@/prisma/generated/internal/prismaNamespace";
import { getProblemById } from "./problemsService";
import getSubmissionResult from "../lib/judge0/submissionResult";
import { redis } from "../lib/redis";
import { getLineCount } from "../lib/getLineCount";

const TESTCASES_CACHE_TTL_SECONDS = 60 * 60; // 1h

export async function runCode(
  problemID: number,
  userCode: string,
  userTestcases: string,
  languageId: number,
) {
  const problem = await getProblemById(problemID, {
    params: true,
    header: true,
    driver: true,
    time_limit: true,
  });

  const paramsCount = (problem.params as JsonArray).length;

  if (paramsCount === 0) {
    throw {
      error: "Invalid problem configuration: params cannot be empty",
      status: 500,
    };
  }

  const sourceCode = problem.header + "\n" + userCode + "\n" + problem.driver;

  const testcases =
    getLineCount(userTestcases) / paramsCount + "\n" + userTestcases;

  const submissionResult = await getSubmissionResult(
    sourceCode,
    languageId,
    testcases,
    problem.time_limit,
  );

  return submissionResult;
}

export async function submitCode(
  problemID: number,
  userCode: string,
  languageId: number,
) {
  const problem = await getProblemById(problemID, {
    params: true,
    header: true,
    driver: true,
    time_limit: true,
  });

  const paramsCount = (problem.params as JsonArray).length;

  if (paramsCount === 0) {
    throw {
      error: "Invalid problem configuration: params cannot be empty",
      status: 500,
    };
  }

  const sourceCode = problem.header + "\n" + userCode + "\n" + problem.driver;

  const testcasesCacheKey = `problem:${problemID}:all_testcases:v1`;

  let testcases: string | null = null;

  try {
    testcases = await redis.get(testcasesCacheKey);
  } catch {
    // Fallback to DB if Redis is temporarily unavailable.
  }

  if (!testcases) {
    const problemWithTestcases = await getProblemById(problemID, {
      all_testcases: true,
    });

    testcases =
      getLineCount(problemWithTestcases.all_testcases) / paramsCount +
      "\n" +
      problemWithTestcases.all_testcases;

    try {
      await redis.set(testcasesCacheKey, testcases, {
        EX: TESTCASES_CACHE_TTL_SECONDS,
      });
    } catch {
      // Submit should still work even if cache write fails.
    }
  }

  const submissionResult = await getSubmissionResult(
    sourceCode,
    languageId,
    testcases,
    problem.time_limit,
  );

  return submissionResult;
}
