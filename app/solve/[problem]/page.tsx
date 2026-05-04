import { notFound } from "next/navigation";
import Problem from "./problem";
import { getProblemBySlug } from "@/app/services/problemsService";
import type { Problem as ProblemData } from "@/app/lib/problems/types";

export const revalidate = 86400; // 60 * 60 * 24;

interface PageProps {
  params: Promise<{ problem: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: PageProps) {
  const { problem } = await params;

  const data = (await getProblemBySlug(problem, {
    id: true,
    title: true,
    slug: true,
    params: true,
    description: true,
    code: true,
    testcases: true,
    difficulty: true,
  })) as ProblemData;

  if (!data) return notFound();

  return (
    <div className="min-h-screen w-full">
      <Problem problem={data} />
    </div>
  );
}
