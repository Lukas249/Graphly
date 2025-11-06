import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query<RowDataPacket[]>(
      `SELECT id, title, slug, params, description, code, testcases, difficulty FROM problems`,
    );

    conn.release();

    for (const problem of result) {
      problem["params"] = JSON.parse(problem["params"]);
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleError(err);
  }
}
