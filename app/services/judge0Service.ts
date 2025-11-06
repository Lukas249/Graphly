import { JsonArray } from "@/prisma/generated/internal/prismaNamespace";
import { getProblemById } from "./problemsService";
import getSubmissionResult from "../lib/judge0/submitCode";

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

  const sourceCode = problem.header + "\n" + userCode + "\n" + problem.driver;

  const testcases =
    userTestcases.split("\n").length / paramsCount + "\n" + userTestcases;

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
    all_testcases: true,
    time_limit: true,
  });

  const paramsCount = (problem.params as JsonArray).length;

  const sourceCode = problem.header + "\n" + userCode + "\n" + problem.driver;

  const testcases =
    problem.all_testcases.split("\n").length / paramsCount +
    "\n" +
    problem.all_testcases;

  const submissionResult = await getSubmissionResult(
    sourceCode,
    languageId,
    testcases,
    problem.time_limit,
  );

  return submissionResult;
}
