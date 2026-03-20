import Menu from "@/app/menu";
import { notFound } from "next/navigation";
import { LinkList } from "@/app/components/linkList/linkList";
import { getProblems } from "@/app/services/problemsService";

export const revalidate = 60;

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
