import { decodeUtf8Base64 } from "../lib/decodeBase64";
import Accepted from "./status/accepted";
import Error from "./status/error";
import TLE from "./status/tle";
import WrongAnswer from "./status/wrongAnswer";
import { SubmissionResult } from "./submitCode";

export function resultType(result: SubmissionResult) {
    const stderr = result.stderr ? decodeUtf8Base64(result.stderr) : "";

    if(result.stderr && /Wrong Answer/.test(stderr)) {
        return "Wrong Answer"
    }

    return result?.status?.description
}

export default function Result({result, sourceCode} : {result: SubmissionResult, sourceCode: string}) {

    const stderr = result.stderr ? decodeUtf8Base64(result.stderr) : ""
    const message = result.message ? decodeUtf8Base64(result.message) : ""
    const compile_output = result.compile_output ? decodeUtf8Base64(result.compile_output) : ""

    return (
        <div className="p-2">
            {
                (result.status.id === 3 && <Accepted result={result} sourceCode={sourceCode} />) ||
                (result.status.id === 6 && <Error title={result.status.description} message={compile_output} />) || 
                (result.stderr && /Wrong Answer/.test(stderr) && <WrongAnswer result={result} sourceCode={sourceCode} />) ||
                (result.status.id === 5 && result.message && <TLE title={result.status.description} message={message} />) ||
                (result.status.id >= 7 && result.message && <Error title={result.status.description} message={message} />)
            }
        </div>
    )
}