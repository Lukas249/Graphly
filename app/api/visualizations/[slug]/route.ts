import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../handleError";
import { getVisualizationBySlug } from "@/app/services/visualizationsService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const visualization = await getVisualizationBySlug(slug);
    return NextResponse.json(visualization);
  } catch (err: unknown) {
    return handleError(err);
  }
}
