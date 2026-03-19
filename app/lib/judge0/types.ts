export type SubmissionStatus = {
  id: number;
  description: string;
};

export type SubmissionResult = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: SubmissionStatus;
  token: string;
  time: number;
  memory: number;
};
