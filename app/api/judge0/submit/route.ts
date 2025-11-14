import { NextRequest, NextResponse } from "next/server";
import { UserSubmitCode } from "../types";
import { handleError } from "../../handleError";
import { submitCode } from "@/app/services/judge0Service";

export async function POST(request: NextRequest) {
  try {
    const bodyData: UserSubmitCode = await request.json();

    const submissionResult = await submitCode(
      bodyData.problemID,
      bodyData.sourceCode,
      bodyData.languageId,
    );
    return NextResponse.json(submissionResult, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}
