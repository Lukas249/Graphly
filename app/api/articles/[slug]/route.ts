import { NextResponse } from "next/server";
import { handleError } from "../../handleError";
import { getArticleBySlug } from "@/app/services/articlesService";
import { NextApiRequest } from "next";

export async function GET(
  request: NextApiRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const articles = await getArticleBySlug(slug);
    return NextResponse.json(articles);
  } catch (err: unknown) {
    return handleError(err);
  }
}
