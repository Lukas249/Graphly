import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../handleError";
import { getArticleBySlug } from "@/app/services/articlesService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const articles = await getArticleBySlug(slug);
    return NextResponse.json(articles);
  } catch (err: unknown) {
    return handleError(err);
  }
}
