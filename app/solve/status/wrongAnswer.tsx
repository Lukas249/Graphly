import { decodeUtf8Base64 } from "@/app/lib/decodeBase64";
import { SubmissionResult } from "../submitCode";

export default function WrongAnswer({ result }: { result: SubmissionResult }) {
  const stderr = decodeUtf8Base64(result.stderr ?? "");
  const stderrArray = stderr.split("\n");

  return (
    <>
      <p className="my-2 ml-3 text-2xl text-red-400">{stderrArray[0]}</p>

      <div className="bg-gray-dark-850 relative rounded-xl p-2">
        <div className="border-primary border-b-2 px-1 py-2">
          <p>Time: {result?.time * 1000} ms</p>
          <p>Memory: {result?.memory} KB</p>
        </div>

        <p className="px-1 py-2">Testcase</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {stderrArray[1]}
        </pre>

        <p className="px-1 py-2">Output</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {stderrArray[2]}
        </pre>

        <p className="px-1 py-2">Expected</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {stderrArray[3]}
        </pre>
      </div>
    </>
  );
}
