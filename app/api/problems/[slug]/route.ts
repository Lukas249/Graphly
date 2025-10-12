import { NextRequest, NextResponse } from "next/server";
import { Problem } from "@/app/data/types/problems";
import pool from "@/app/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;

  try {
    const conn = await pool.getConnection();

    const [result] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM problems where slug = ?`,
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

export async function POST(request: NextRequest) {
  const problemData: Problem = await request.json();

  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query<ResultSetHeader[]>(
      `SELECT * FROM problems WHERE id = ?`,
      [problemData.id],
    );

    if (!rows.length) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO problems (title, slug, params, description, code, header, driver, testcases, all_testcases)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          problemData.title,
          problemData.slug,
          JSON.stringify(problemData.params),
          problemData.description,
          problemData.code,
          problemData.header,
          problemData.driver,
          problemData.testcases,
          problemData.all_testcases,
        ],
      );
    } else {
      await conn.query<ResultSetHeader>(
        `UPDATE problems 
          SET title = ?, slug = ?, params = ?, description = ?, code = ?, header = ?, driver = ?, testcases = ?, all_testcases = ?
          WHERE id = ?`,
        [
          problemData.title,
          problemData.slug,
          JSON.stringify(problemData.params),
          problemData.description,
          problemData.code,
          problemData.header,
          problemData.driver,
          problemData.testcases,
          problemData.all_testcases,
          problemData.id,
        ],
      );
    }

    conn.release();

    return NextResponse.json({ success: true }, { status: 200 });
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

export async function DELETE(request: NextRequest) {
  const problem: { id: number } = await request.json();

  try {
    const conn = await pool.getConnection();

    await conn.query<ResultSetHeader>(`DELETE FROM problems WHERE id = ?`, [
      problem.id,
    ]);

    conn.release();

    return NextResponse.json({ success: true }, { status: 200 });
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
