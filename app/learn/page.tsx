"use server";

import Menu from "../menu";
import { notFound } from "next/navigation";
import { LinkList } from "../components/linkList/linkList";
import { getArticles } from "../services/articlesService";

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
