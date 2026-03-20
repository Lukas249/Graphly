import Menu from "@/app/menu";
import { notFound } from "next/navigation";
import { LinkList } from "@/app/components/linkList/linkList";
import { getArticles } from "@/app/services/articlesService";

export const revalidate = 60;

export default async function LearnPage() {
  const articles = await getArticles({ id: true, title: true, slug: true });

  if (!articles) return notFound();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Articles</h2>
        <LinkList
          links={articles}
          prefetch={false}
          slugPrefix="learn/"
          linkType="learn"
        />
      </div>
    </div>
  );
}
