import { TestcaseResult } from "./result";
import React from "react";

import "./style.css";

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
                <pre className="result-message">{variable}</pre>
              </React.Fragment>
            );
          })}

        {testcase?.printed && (
          <>
            <p className="px-1 py-2">Console</p>
            <pre className="result-message">{testcase?.printed}</pre>
          </>
        )}

        <p className="px-1 py-2">Output</p>
        <pre className="result-message">{testcase?.got}</pre>

        <p className="px-1 py-2">Expected</p>
        <pre className="result-message">{testcase?.expected}</pre>
      </div>
    </>
  );
}
