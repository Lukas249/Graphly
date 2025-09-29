import { SubmissionResult } from "../submitCode";

export default function Accepted({
  result,
  sourceCode,
}: {
  result: SubmissionResult;
  sourceCode: string;
}) {
  return (
    <>
      <p className="my-2 ml-3 text-2xl text-green-400">
        {result.status.description}
      </p>

      <div className="bg-gray-dark-850 relative rounded-xl p-2">
        <div className="border-primary border-b-2 px-1 py-2">
          <p>Time: {result.time * 1000} ms</p>
          <p>Memory: {result.memory} KB</p>
        </div>

        <p className="px-1 py-2">Submitted code</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {sourceCode}
        </pre>
      </div>
    </>
  );
}
