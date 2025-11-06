import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;

  try {
    const conn = await pool.getConnection();

    const [result] = await conn.query<RowDataPacket[]>(
      `SELECT id, title, slug, params, description, code, testcases, difficulty FROM problems where slug = ?`,
      [slug],
    );

    conn.release();

    if (!result.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    result[0]["params"] = JSON.parse(result[0]["params"]);

    return NextResponse.json(result[0]);
  } catch (err: unknown) {
    return handleError(err);
  }
}
