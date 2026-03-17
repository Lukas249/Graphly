"use server";

import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../handleError";
import { processCodeAnalysis } from "@/app/services/geminiCodeFeedback";

export async function POST(req: NextRequest) {
  try {
    const { message, contexts } = await req.json();

    const answer = await processCodeAnalysis(message, contexts);

    return NextResponse.json(answer);
  } catch (err) {
    return handleError(err);
  }
}
