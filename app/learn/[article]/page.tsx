"use server";

import Article from "./article";
import { notFound } from "next/navigation";
import { fetchAllArticles, fetchArticle } from "@/app/lib/articles/articles";

interface PageProps {
  params: Promise<{ article: string }>;
}

export default async function LearnPage({ params }: PageProps) {
  const { article } = await params;

  const articles = await fetchAllArticles();

  const articleData = await fetchArticle(article);

  if (!articleData || !articles) return notFound();

  return <Article articleData={articleData} articles={articles} />;
}
