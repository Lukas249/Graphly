import { TestcaseResult } from "./result";
import React from "react";

export default function WrongAnswer({
  testcase,
  paramsNames,
}: {
  testcase?: TestcaseResult;
  paramsNames?: string[];
}) {
  return (
    <>
      <p className="my-2 ml-3 text-2xl text-red-400">Wrong Answer</p>

      <div className="bg-gray-dark-850 relative rounded-xl p-2">
        {testcase &&
          paramsNames &&
          testcase.args.map((variable, i) => {
            return (
              <React.Fragment key={i}>
                <p className="px-1 py-2">{paramsNames[i]}</p>
                <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
                  {variable}
                </pre>
              </React.Fragment>
            );
          })}

        {testcase?.printed && (
          <>
            <p className="px-1 py-2">Console</p>
            <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
              {testcase?.printed}
            </pre>
          </>
        )}

        <p className="px-1 py-2">Output</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {testcase?.got}
        </pre>

        <p className="px-1 py-2">Expected</p>
        <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
          {testcase?.expected}
        </pre>
      </div>
    </>
  );
}
