import { decodeUtf8Base64 } from "../lib/decodeBase64";

type SubmissionStatus = {
    id: number
    description: string
}

export type SubmissionResult = {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  exit_code?: number | null
  exit_signal?: number | null
  status: SubmissionStatus
  created_at?: Date | null
  finished_at?: Date | null
  token: string
  time: number
  wall_time?: number
  memory: number
}

export default async function getSubmissionResult (sourceCode: string, languageId: number, testcases: string): Promise<SubmissionResult> {
    let intervalId: NodeJS.Timeout, timeoutId: NodeJS.Timeout;

    const cleanup = () => {
          if (intervalId !== undefined) clearInterval(intervalId);
          if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
    
    const fetchData = await fetch("http://localhost:2358/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: testcases,
        base64_encoded: true,
        callback_url: "http://localhost:3000"
      })
    })

    const data = await fetchData.json()
    
    const token = data.token;

    timeoutId = setTimeout(() => {
      cleanup()
    }, 30_000)

    return await new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            fetch(`http://localhost:2358/submissions/${token}?base64_encoded=true`)
            .then(res => {
                return res.json()
            })
            .then(result => {
                if (result && result.status && result.status.id <= 2) {
                console.log("Czekam...");
                return;
                }
                cleanup()
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                cleanup()
                reject(err)
            })
        }, 5000);
    })
  }