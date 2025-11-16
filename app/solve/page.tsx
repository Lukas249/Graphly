"use server";

import Menu from "../menu";
import { notFound } from "next/navigation";
import { LinkList } from "../components/linkList/linkList";
import { getProblems } from "../services/problemsService";

export default async function SolvePage() {
  const problems = await getProblems({
    id: true,
    title: true,
    slug: true,
    difficulty: true,
  });

  if (!problems) return notFound();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Problemset</h2>
        <LinkList
          links={problems}
          prefetch={false}
          slugPrefix="solve/"
          linkType="solve"
        />
      </div>
    </div>
  );
}
