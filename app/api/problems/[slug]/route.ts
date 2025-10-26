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
    if (typeof err === "object" && err && "sqlMessage" in err) {
      return NextResponse.json({ error: err.sqlMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
