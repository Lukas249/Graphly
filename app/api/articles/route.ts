import { NextResponse } from "next/server";
import { handleError } from "../handleError";
import { getArticles } from "@/app/services/articlesService";

export async function GET() {
  try {
    const articles = await getArticles({ id: true, title: true, slug: true });
    return NextResponse.json(articles);
  } catch (err: unknown) {
    return handleError(err);
  }
}
