"use server";

import { processChatMessage } from "@/app/services/geminiService";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../handleError";

export async function POST(req: NextRequest) {
  try {
    const { message, contexts, chatSessionID } = await req.json();

    const answer = await processChatMessage(message, contexts, chatSessionID);

    return NextResponse.json(answer);
  } catch (err) {
    return handleError(err);
  }
}
