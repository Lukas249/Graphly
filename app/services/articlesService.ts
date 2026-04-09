import "server-only";

import { Prisma } from "@/prisma/generated/client";
import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/lib/errors/appError";

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
    throw new AppError("Not found", 404);
  }

  return article;
}

export async function getArticles(select?: Prisma.articlesSelect) {
  const articles = await prisma.articles.findMany({
    select,
  });

  if (!articles.length) {
    throw new AppError("Not found", 404);
  }

  return articles;
}
