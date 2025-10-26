import { SubmissionResult } from "./types";

export default async function getSubmissionResult(
  sourceCode: string,
  languageId: number,
  testcases: string,
  timeLimit: number,
): Promise<SubmissionResult> {
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
      }),
    },
  );

  const data = await fetchData.json();

  const token = data.token;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
      )
        .then((res) => res.json())
        .then((result) => {
          if (result && result.status && result.status.id <= 2) {
            reject({ error: "TLE" });
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject({ error: err });
        });
    }, timeLimit);
  });
}
