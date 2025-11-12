import { Prisma } from "@/prisma/generated/client";
import { prisma } from "../lib/prisma";

export async function getArticleBySlug(
  slug: string,
  select?: Prisma.articlesSelect,
) {
  const article = await prisma.articles.findUnique({
    select,
    where: {
      slug,
    },
  });

  if (!article) {
    throw { error: "Not found", status: 404 };
  }

  return article;
}

export async function getArticles(select?: Prisma.articlesSelect) {
  const articles = await prisma.articles.findMany({
    select,
  });

  if (!articles.length) {
    throw { error: "Not found", status: 404 };
  }

  return articles;
}
