import { NextRequest, NextResponse } from "next/server";
import { UserRunCode } from "../types";
import { handleError } from "../../handleError";
import { runCode } from "@/app/services/judge0Service";

export async function POST(request: NextRequest) {
  try {
    const bodyData: UserRunCode = await request.json();
    const submissionResult = await runCode(
      bodyData.problemID,
      bodyData.sourceCode,
      bodyData.testcases,
      bodyData.languageId,
    );
    return NextResponse.json(submissionResult, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}
