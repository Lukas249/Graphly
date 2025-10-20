import { decodeUtf8Base64 } from "../lib/decodeBase64";
import Accepted from "./status/accepted";
import Error from "./status/error";
import TLE from "./status/tle";
import WrongAnswer from "./status/wrongAnswer";
import { SubmissionResult } from "./submitCode";

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
  params,
}: {
  result: SubmissionResult;
  sourceCode: string;
  feedbackAI?: string;
  params?: string[];
}) {
  const stdout: StdOutResult = result.stdout
    ? JSON.parse(decodeUtf8Base64(result.stdout))
    : {};
  const message = result.message ? decodeUtf8Base64(result.message) : "";
  const compile_output = result.compile_output
    ? decodeUtf8Base64(result.compile_output)
    : "";

  if (stdout.testcase) {
    stdout.testcase.args = stdout.testcase.args.map((val) =>
      JSON.stringify(val),
    );
    stdout.testcase.expected = JSON.stringify(stdout.testcase.expected);
    stdout.testcase.got = JSON.stringify(stdout.testcase.got);
  }

  return (
    <div className="p-2">
      {(/Wrong Answer/.test(stdout.status) && (
        <WrongAnswer testcase={stdout.testcase} params={params} />
      )) ||
        (result.status.id === 3 && (
          <Accepted
            result={result}
            sourceCode={sourceCode}
            feedbackAI={feedbackAI}
          />
        )) ||
        (result.status.id === 6 && (
          <Error title={result.status.description} message={compile_output} />
        )) ||
        (result.status.id === 5 && result.message && (
          <TLE title={result.status.description} message={message} />
        )) ||
        (result.status.id >= 7 && result.message && (
          <Error title={result.status.description} message={message} />
        ))}
    </div>
  );
}
