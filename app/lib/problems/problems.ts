import { Problem } from "./types";

export async function fetchAllProblems() {
  return handleJSONResponse<Problem[]>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems`),
  );
}

export async function fetchProblem(problem: string) {
  return handleJSONResponse<Problem>(
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems/${problem}`),
  );
}

async function handleJSONResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status}: ${error.error}`);
  }
  return await response.json();
}
