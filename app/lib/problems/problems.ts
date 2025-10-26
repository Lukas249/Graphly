import { Problem } from "./types";

class HttpError extends Error {
  status;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

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
    throw new HttpError(error.error, response.status);
  }
  return await response.json();
}
