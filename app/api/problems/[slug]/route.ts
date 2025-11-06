import { NextRequest, NextResponse } from "next/server";
import { getProblemBySlug } from "@/app/services/problemsService";
import { handleError } from "../../handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;

  try {
    const problem = await getProblemBySlug(slug, {
      id: true,
      title: true,
      slug: true,
      params: true,
      description: true,
      code: true,
      testcases: true,
      difficulty: true,
    });
    return NextResponse.json(problem);
  } catch (err: unknown) {
    return handleError(err);
  }
}
