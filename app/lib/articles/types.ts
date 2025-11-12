import { Question } from "@/app/components/quiz/quiz-card";

export type Article = {
  id: number;
  title: string;
  slug: string;
  article: string;
  quiz: Question[];
};

export type ArticleNavItem = Pick<Article, "id" | "title" | "slug">;
