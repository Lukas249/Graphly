import { handleJSONResponse } from "../handleResponse";
import { Article, ArticleNavItem } from "./types";

export async function fetchAllArticles() {
  return handleJSONResponse<ArticleNavItem[]>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`),
  );
}

export async function fetchArticle(slug: string) {
  return handleJSONResponse<Article>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`),
  );
}
