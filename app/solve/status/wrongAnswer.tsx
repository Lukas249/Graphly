import { decodeUtf8Base64 } from "@/app/lib/decodeBase64"
import { SubmissionResult } from "../submitCode"

export default function WrongAnswer({ result } : { result: SubmissionResult }) {

    const stderr = decodeUtf8Base64(result?.stderr ?? "")
    const stderrArray = stderr.split("\n")

    return (
      <>
        <p className="text-red-400 text-2xl my-2 ml-3">{stderrArray[0]}</p>
        
        <div className="relative bg-gray-dark-850 rounded-xl p-2">
            <div className="py-2 px-1 border-b-2 border-primary">
                <p>Time: {result?.time * 1000} ms</p>
                <p>Memory: {result?.memory} KB</p>
            </div>
            
            <p className="py-2 px-1">Testcase</p>
            <pre className="bg-gray-dark text-gray-100 p-3 rounded-lg">
                {stderrArray[1]}
            </pre>

            <p className="py-2 px-1">Output</p>
            <pre className="bg-gray-dark text-gray-100 p-3 rounded-lg">
                {stderrArray[2]}
            </pre>

            <p className="py-2 px-1">Expected</p>
            <pre className="bg-gray-dark text-gray-100 p-3 rounded-lg">
                {stderrArray[3]}
            </pre>
        </div>
      </>
    )
}