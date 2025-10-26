export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export type Problem = {
  id: number;
  title: string;
  slug: string;
  params: string[];
  description: string;
  code: string;
  testcases: string;
  difficulty: ProblemDifficulty;
};
