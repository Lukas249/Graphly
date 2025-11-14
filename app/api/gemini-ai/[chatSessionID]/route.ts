import { getChatHistory } from "@/app/services/chatStorage";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { handleError } from "../../handleError";

export async function GET(
  req: NextApiRequest,
  { params }: { params: Promise<{ chatSessionID: string }> },
) {
  try {
    const { chatSessionID } = await params;

    if (typeof chatSessionID !== "string") {
      throw new Error("chatSessionID should be a string");
    }

    const history = await getChatHistory(chatSessionID);

    return NextResponse.json(history);
  } catch (err) {
    return handleError(err);
  }
}
