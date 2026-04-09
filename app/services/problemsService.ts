import "server-only";

import { Prisma } from "@/prisma/generated/client";
import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/lib/errors/appError";

export async function getProblemById(
  id: number,
  select?: Prisma.problemsSelect,
) {
  const problem = await prisma.problems.findUnique({
    select,
    where: {
      id,
    },
  });

  if (!problem) {
    throw new AppError(`Not found problem with ID ${id}`, 404);
  }

  return problem;
}

export async function getProblemBySlug(
  slug: string,
  select?: Prisma.problemsSelect,
) {
  const problem = await prisma.problems.findUnique({
    select,
    where: {
      slug,
      is_challenge: false,
    },
  });

  if (!problem) {
    throw new AppError(`Not found problem with slug ${slug}`, 404);
  }

  return problem;
}

export async function getProblems(select?: Prisma.problemsSelect) {
  const problems = await prisma.problems.findMany({
    select,
    where: {
      is_challenge: false,
    },
  });

  if (!problems.length) {
    throw new AppError("Not found problems", 404);
  }

  return problems;
}

export async function getProblemChallengeBySlug(
  slug: string,
  select?: Prisma.problemsSelect,
) {
  const problem = await prisma.problems.findUnique({
    select,
    where: {
      slug,
      is_challenge: true,
    },
  });

  if (!problem) {
    throw new AppError(`Not found problem challenge with slug ${slug}`, 404);
  }

  return problem;
}

export async function getProblemsChallenge(select?: Prisma.problemsSelect) {
  const problems = await prisma.problems.findMany({
    select,
    where: {
      is_challenge: true,
    },
  });

  if (!problems.length) {
    throw new AppError("Not found problems challenges", 404);
  }

  return problems;
}
