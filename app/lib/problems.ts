export async function fetchAllProblems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/problems`);
  const data = await res.json();
  return data;
}

export async function fetchProblem(problem: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/problems/${problem}`,
  );
  const data = await res.json();
  return data;
}
