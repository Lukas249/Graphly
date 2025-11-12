import { Prisma } from "@/prisma/generated/client";
import { prisma } from "../lib/prisma";

export async function getVisualizationBySlug(
  slug: string,
  select?: Prisma.visualizationsSelect,
) {
  const visualization = await prisma.visualizations.findUnique({
    select,
    where: {
      slug,
    },
  });

  if (!visualization) {
    throw { error: "Not found", status: 404 };
  }

  return visualization;
}

export async function getVisualizations(select?: Prisma.visualizationsSelect) {
  const visualizations = await prisma.visualizations.findMany({
    select,
  });

  if (!visualizations.length) {
    throw { error: "Not found", status: 404 };
  }

  return visualizations;
}
