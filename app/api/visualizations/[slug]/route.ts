import { NextResponse } from "next/server";
import { handleError } from "../../handleError";
import { NextApiRequest } from "next";
import { getVisualizationBySlug } from "@/app/services/visualizationsService";

export async function GET(
  request: NextApiRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const visualization = await getVisualizationBySlug(slug);
    return NextResponse.json(visualization);
  } catch (err: unknown) {
    return handleError(err);
  }
}
