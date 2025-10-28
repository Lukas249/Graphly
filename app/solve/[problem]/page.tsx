"use server";

import Problem from "./problem";
import { fetchProblem } from "@/app/lib/problems/problems";

interface PageProps {
  params: Promise<{ problem: string }>;
}

export default async function Page({ params }: PageProps) {
  const { problem } = await params;

  const data = await fetchProblem(problem);

  return (
    <div className="min-h-screen w-full">
      <Problem problem={data} />
    </div>
  );
}
