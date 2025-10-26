import pool from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { UserSubmitCode } from "../types";
import { RowDataPacket } from "mysql2";
import getSubmissionResult from "@/lib/judge0/submitCode";

export async function POST(request: NextRequest) {
  const bodyData: UserSubmitCode = await request.json();

  try {
    const conn = await pool.getConnection();

    const [result] = await conn.query<RowDataPacket[]>(
      `SELECT params, header, driver, all_testcases, time_limit FROM problems where id = ?`,
      [bodyData.problemID],
    );

    conn.release();

    if (!result.length) {
      return NextResponse.json({ error: "Not found problem" }, { status: 400 });
    }

    const params = JSON.parse(result[0].params);
    const paramsCount = params.length;

    const testcases = result[0].all_testcases;

    const sourceCode =
      result[0].header + "\n" + bodyData.sourceCode + "\n" + result[0].driver;
    const allTestcases =
      testcases.split("\n").length / paramsCount + "\n" + testcases;

    const submissionResult = await getSubmissionResult(
      sourceCode,
      bodyData.languageId,
      allTestcases,
      result[0].time_limit,
    );

    return NextResponse.json(submissionResult, { status: 200 });
  } catch (err: unknown) {
    if (typeof err === "object" && err && "error" in err) {
      return NextResponse.json({ error: err.error }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
