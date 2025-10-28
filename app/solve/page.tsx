"use server";

import Link from "next/link";

import { fetchAllProblems } from "../lib/problems/problems";
import Menu from "../menu";
import { difficultyColors } from "../lib/problems/difficulty-colors";

export default async function SolvePage() {
  const data = await fetchAllProblems();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Problemset</h2>
        {data && (
          <div className="w-full text-center">
            {data.map((problem) => (
              <Link
                key={problem.id}
                href={"/solve/" + problem.slug}
                className="cursor-pointer"
              >
                <div
                  key={problem.id}
                  className="bg-gray-dark hover:border-primary my-2 flex h-10 items-center justify-between rounded-lg px-4 hover:border-2"
                >
                  <p>
                    {problem.id}. {problem.title}
                  </p>
                  <span
                    style={{
                      color: difficultyColors[problem.difficulty],
                    }}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
