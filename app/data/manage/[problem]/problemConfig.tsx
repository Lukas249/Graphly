"use client";

import type { Problem as ProblemDetails } from "@/app/data/types/problems";
import { generateSlug } from "@/app/lib/generateSlug";
import _ from "lodash";
import { useState } from "react";

export default function ProblemConfig({
  problem,
}: {
  problem: ProblemDetails;
}) {
  const inputs: Record<string, boolean> = {
    title: true,
    params: true,
  };

  const [config, setConfig] = useState<Record<string, string>>({
    title: problem.title,
    params: JSON.stringify(problem.params),
    description: problem.description,
    code: problem.code,
    header: problem.header,
    driver: problem.driver,
    testcases: problem.testcases,
    all_testcases: problem.all_testcases,
  });

  function onChange(label: string, text: string) {
    setConfig((prevConfig) => {
      const config = _.cloneDeep(prevConfig);
      config[label] = text;
      return config;
    });
  }

  function save(problem: Record<string, string | number>) {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems/${problem.slug}`, {
      method: "POST",
      body: JSON.stringify(problem),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-4">
      {Object.entries(config).map(([label, value]) => {
        return (
          <div
            key={label}
            className="bg-gray-dark flex w-full flex-col gap-2 rounded-lg p-4"
          >
            <label>{label}</label>
            {inputs[label] ? (
              <input
                className="bg-gray-dark-850 p-2 outline-0"
                value={value}
                onChange={(e) => onChange(label, e.currentTarget.value)}
              />
            ) : (
              <textarea
                className="bg-gray-dark-850 min-h-96 p-2 outline-0"
                value={value}
                onChange={(e) => onChange(label, e.currentTarget.value)}
              />
            )}
          </div>
        );
      })}

      <button
        className="btn"
        onClick={() =>
          save({ ...config, id: problem.id, slug: generateSlug(config.title) })
        }
      >
        Save
      </button>
    </div>
  );
}
