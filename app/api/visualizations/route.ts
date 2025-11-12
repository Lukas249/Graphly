import { NextResponse } from "next/server";
import { handleError } from "../handleError";
import { getVisualizations } from "@/app/services/visualizationsService";

export async function GET() {
  try {
    const visualizations = await getVisualizations({
      id: true,
      title: true,
      slug: true,
    });
    return NextResponse.json(visualizations);
  } catch (err: unknown) {
    return handleError(err);
  }
}
