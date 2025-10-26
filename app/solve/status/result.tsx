import { SubmissionResult } from "@/app/lib/judge0/types";
import { decodeUtf8Base64 } from "../../lib/decodeBase64";
import Accepted from "./accepted";
import Error from "./error";
import TLE from "./tle";
import WrongAnswer from "./wrongAnswer";

export type TestcaseResult = {
  args: string[];
  got: string;
  expected: string;
  printed: string;
};

export type StdOutResult = {
  status: string;
  testcase?: TestcaseResult;
};

export function resultType(result: SubmissionResult) {
  const stdout: StdOutResult = result.stdout
    ? JSON.parse(decodeUtf8Base64(result.stdout))
    : {};

  if (/Wrong Answer/.test(stdout.status) && stdout.testcase) {
    return "Wrong Answer";
  }

  return result?.status?.description;
}

export default function Result({
  result,
  sourceCode,
  feedbackAI,
  paramsNames,
}: {
  result: SubmissionResult;
  sourceCode: string;
  feedbackAI?: string;
  paramsNames?: string[];
}) {
  const stdout: StdOutResult = result.stdout
    ? JSON.parse(decodeUtf8Base64(result.stdout))
    : {};
  const message = result.message ? decodeUtf8Base64(result.message) : "";
  const compile_output = result.compile_output
    ? decodeUtf8Base64(result.compile_output)
    : "";
  const stderr = decodeUtf8Base64(result.stderr ?? "");

  if (stdout.testcase) {
    stdout.testcase.args = stdout.testcase.args.map((val) =>
      JSON.stringify(val),
    );
    stdout.testcase.expected = JSON.stringify(stdout.testcase.expected);
    stdout.testcase.got = JSON.stringify(stdout.testcase.got);
  }

  let resultContent = null;

  if (/Wrong Answer/.test(stdout.status)) {
    resultContent = (
      <WrongAnswer testcase={stdout.testcase} paramsNames={paramsNames} />
    );
  } else if (result.status.id === 3) {
    resultContent = (
      <Accepted
        result={result}
        sourceCode={sourceCode}
        feedbackAI={feedbackAI}
      />
    );
  } else if (result.status.id === 5) {
    resultContent = <TLE title={result.status.description} message={message} />;
  } else {
    resultContent = (
      <Error
        title={result.status.description}
        message={message}
        compile_output={compile_output}
        stderr={stderr}
      />
    );
  }

  return <div className="p-2">{resultContent}</div>;
}
