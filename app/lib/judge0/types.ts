export type SubmissionStatus = {
  id: number;
  description: string;
};

export type SubmissionResult = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  exit_code?: number | null;
  exit_signal?: number | null;
  status: SubmissionStatus;
  created_at?: Date | null;
  finished_at?: Date | null;
  token: string;
  time: number;
  wall_time?: number;
  memory: number;
};
