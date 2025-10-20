"use client";

import Problem from "./problem";
import { use, useMemo } from "react";
import { useAsync } from "@/app/hooks/useAsync";
import { fetchProblem } from "@/app/lib/problems";
import Error from "next/error";

interface PageProps {
  params: Promise<{ problem: string }>;
}

export default function Page({ params }: PageProps) {
  const { problem } = use(params);

  const { data, error, loading } = useAsync(
    useMemo(() => () => fetchProblem(problem), [problem]),
  );

  return (
    <div className="min-h-screen w-full">
      {data && <Problem problem={data} />}
      {loading && "Loading..."}
      {error && <Error statusCode={error.status} title={error.message} />}
    </div>
  );
}
