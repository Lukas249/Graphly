import { NextResponse } from "next/server";
import { AppError } from "@/app/lib/errors/appError";
import { logger } from "@/app/lib/logger";

type ApiError =
  | { sqlMessage: string }
  | { error: string; status: number | string }
  | Error
  | unknown;

function hasSqlMessage(err: unknown): err is { sqlMessage: string } {
  return (
    typeof err === "object" && err !== null && Reflect.has(err, "sqlMessage")
  );
}

function isLegacyApiError(
  err: unknown,
): err is { error: string; status: number | string } {
  return (
    typeof err === "object" && err !== null && "error" in err && "status" in err
  );
}

function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}

export function handleError(err: ApiError) {
  if (err instanceof AppError) {
    logger.error("App error", { message: err.message, status: err.status });
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  if (hasSqlMessage(err)) {
    logger.error("SQL error", err);
    return NextResponse.json({ error: err.sqlMessage }, { status: 400 });
  }

  if (isLegacyApiError(err)) {
    logger.error("Legacy API error", err);
    return NextResponse.json(
      { error: err.error },
      { status: Number(err.status) || 500 },
    );
  }

  if (isError(err)) {
    logger.error("Unhandled error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  logger.error("Unknown error", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
