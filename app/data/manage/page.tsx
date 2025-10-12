"use client";

import { fetchAllProblems } from "@/app/lib/problems";

import { useState, useEffect } from "react";
import { Problem } from "../types/problems";
import Link from "next/link";

export function useAsync<T>(promiseFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    promiseFn()
      .then((result) => isMounted && setData(result))
      .catch((err) => isMounted && setError(err.message || "Unknown error"))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [promiseFn]);

  return { data, loading, error };
}

export default function CodeStringEditor() {
  const { data, loading, error } = useAsync<Problem[]>(fetchAllProblems);
  console.log(data);
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex">
        {loading && "Loading..."}
        {data
          ? data.map((problem) => {
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
          : error}
      </div>
    </div>
  );
}
