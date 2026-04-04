import { notFound } from "next/navigation";
import { getProblemChallengeBySlug } from "@/app/services/problemsService";
import type { Problem as ProblemData } from "@/app/lib/problems/types";
import Problem from "@/app/solve/[problem]/problem";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const data = (await getProblemChallengeBySlug(slug, {
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
