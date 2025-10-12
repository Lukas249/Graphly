type SubmissionStatus = {
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

export default async function getSubmissionResult(
  sourceCode: string,
  languageId: number,
  testcases: string,
): Promise<SubmissionResult> {
  const cleanup = ({ intervalID }: { intervalID?: NodeJS.Timeout }) => {
    if (intervalID !== undefined) clearInterval(intervalID);
  };

  const fetchData = await fetch(
    `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: testcases,
        base64_encoded: true,
        callback_url: process.env.NEXT_PUBLIC_BASE_URL,
      }),
    },
  );

  const data = await fetchData.json();

  const token = data.token;

  return await new Promise((resolve, reject) => {
    const intervalID = setInterval(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
      )
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          if (result && result.status && result.status.id <= 2) {
            return;
          }

          cleanup({ intervalID });
          resolve(result);
        })
        .catch((err) => {
          cleanup({ intervalID });
          reject(err);
        });
    }, 5000);
  });
}
