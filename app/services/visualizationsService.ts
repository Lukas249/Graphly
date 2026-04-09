import "server-only";

import { Prisma } from "@/prisma/generated/client";
import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/lib/errors/appError";

export async function getVisualizationBySlug(
  slug: string,
  select?: Prisma.visualizationsSelect,
) {
  const visualization = await prisma.visualizations.findUnique({
    select,
    where: {
      slug,
      is_challenge: false,
    },
  });

  if (!visualization) {
    throw new AppError("Not found", 404);
  }

  return visualization;
}

export async function getVisualizations(select?: Prisma.visualizationsSelect) {
  const visualizations = await prisma.visualizations.findMany({
    select,
    where: {
      is_challenge: false,
    },
  });

  if (!visualizations.length) {
    throw new AppError("Not found", 404);
  }

  return visualizations;
}

export async function getVisualizationChallengeBySlug(
  slug: string,
  select?: Prisma.visualizationsSelect,
) {
  const visualization = await prisma.visualizations.findUnique({
    select,
    where: {
      slug,
      is_challenge: true,
    },
  });

  if (!visualization) {
    throw new AppError("Not found", 404);
  }

  return visualization;
}

export async function getVisualizationsChallenges(
  select?: Prisma.visualizationsSelect,
) {
  const visualizations = await prisma.visualizations.findMany({
    select,
    where: {
      is_challenge: true,
    },
  });

  if (!visualizations.length) {
    throw new AppError("Not found", 404);
  }

  return visualizations;
}
