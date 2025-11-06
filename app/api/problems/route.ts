import { NextResponse } from "next/server";
import { getProblems } from "@/app/services/problemsService";
import { handleError } from "../handleError";

export async function GET() {
  try {
    const problems = await getProblems({
      id: true,
      title: true,
      slug: true,
      params: true,
      description: true,
      code: true,
      testcases: true,
      difficulty: true,
    });
    return NextResponse.json(problems);
  } catch (err: unknown) {
    return handleError(err);
  }
}
