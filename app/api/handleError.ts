import { NextResponse } from "next/server";

type ApiError =
  | { sqlMessage: string }
  | { error: string; status: number | string }
  | unknown;

export function handleError(err: ApiError) {
  if (err && typeof err === "object") {
    if ("sqlMessage" in err) {
      return NextResponse.json({ error: err.sqlMessage }, { status: 400 });
    }

    if ("error" in err && "status" in err) {
      return NextResponse.json(
        { error: err.error },
        { status: Number(err.status) || 500 },
      );
    }
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
