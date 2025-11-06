import { Prisma } from "@/prisma/generated/client";
import { prisma } from "../lib/prisma";

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
    throw { error: "Not found", status: 404 };
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
    },
  });

  if (!problem) {
    throw { error: "Not found", status: 404 };
  }

  return problem;
}

export async function getProblems(select?: Prisma.problemsSelect) {
  const problems = await prisma.problems.findMany({
    select,
  });

  if (!problems.length) {
    throw { error: "Not found", status: 404 };
  }

  return problems;
}
