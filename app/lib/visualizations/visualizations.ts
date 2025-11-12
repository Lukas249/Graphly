import { handleJSONResponse } from "../handleResponse";
import { Visualization, VisualizationNavItem } from "./types";

export async function fetchAllVisualizations() {
  return handleJSONResponse<VisualizationNavItem[]>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/visualizations`),
  );
}

export async function fetchVisualization(slug: string) {
  return handleJSONResponse<Visualization>(
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/visualizations/${slug}`,
    ),
  );
}
