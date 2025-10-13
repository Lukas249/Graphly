"use client";

import { fetchAllProblems } from "@/app/lib/problems";

import { Problem } from "../types/problems";
import Link from "next/link";
import { useAsync } from "@/app/hooks/useAsync";
import Error from "next/error";

export default function CodeStringEditor() {
  const { data, loading, error } = useAsync<Problem[]>(fetchAllProblems);

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex">
        {loading && "Loading..."}
        {
          data && data.map((problem) => {
              return (
                <Link
                  key={problem.id}
                  href={"/data/manage/" + problem.slug}
                  prefetch={false}
                >
                  <div className="bg-gray-dark hover:bg-primary m-3 cursor-pointer rounded-lg px-2 py-4">
                    <p>
                      {problem.id}. {problem.title}
                    </p>
                  </div>
                </Link>
              );
            })
        }
        {
          error && <Error statusCode={error.status} title={error.message}/>
        }
      </div>
    </div>
  );
}
