import Article from "./article";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/app/services/articlesService";

export const revalidate = 86400; // 60 * 60 * 24;

interface PageProps {
  params: Promise<{ article: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function LearnPage({ params }: PageProps) {
  const { article } = await params;

  const articles = await getArticles({ id: true, title: true, slug: true });

  const articleData = await getArticleBySlug(article);

  if (!articleData || !articles) return notFound();

  return <Article articleData={articleData} articles={articles} />;
}
