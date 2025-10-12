import type { Problem as ProblemDetails } from "@/app/data/types/problems";
import Problem from "./problem";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ problem: string }>;
}

export default async function Page({ params }: PageProps) {
  const { problem } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/problems/${problem}`,
  );

  if (res.status !== 200) return notFound();

  const problemDetails: ProblemDetails = await res.json();

  return (
    <div>
      <Problem problem={problemDetails} />
    </div>
  );
}
