import "server-only";

import { Prisma } from "@/prisma/generated/client";
import { prisma } from "@/app/lib/prisma";

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
    throw { error: "Not found problem with ID " + id, status: 404 };
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
    throw { error: "Not found problem with slug " + slug, status: 404 };
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
    throw { error: "Not found problems", status: 404 };
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
    throw {
      error: "Not found problem challenge with slug " + slug,
      status: 404,
    };
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
    throw { error: "Not found problems challenges", status: 404 };
  }

  return problems;
}
