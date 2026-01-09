import { NextResponse } from "next/server";

type ApiError =
  | { sqlMessage: string }
  | { error: string; status: number | string }
  | unknown;

export function handleError(err: ApiError) {
  if (err && typeof err === "object") {
    if ("sqlMessage" in err) {
      console.log("SQL Error:", err.sqlMessage);
      return NextResponse.json({ error: err.sqlMessage }, { status: 400 });
    }

    if ("error" in err && "status" in err) {
      console.log("API Error:", err.error);
      return NextResponse.json(
        { error: err.error },
        { status: Number(err.status) || 500 },
      );
    }

    if ("message" in err) {
      console.log("Error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  console.log("Unknown error:", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
