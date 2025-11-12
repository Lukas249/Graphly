import { handleJSONResponse } from "../handleResponse";
import { Problem, ProblemNavItem } from "./types";

export async function fetchAllProblems() {
  return handleJSONResponse<ProblemNavItem[]>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems`),
  );
}

export async function fetchProblem(problem: string) {
  return handleJSONResponse<Problem>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems/${problem}`),
  );
}
