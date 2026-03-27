import "client-only";

import {
  CHAT_ROLES,
  Contexts,
  MessageDetails,
} from "@/app/components/chat/types";
import { handleJSONResponse } from "../handleResponse";

export type AskAI = (
  messages: MessageDetails,
  contexts?: Contexts,
) => Promise<string>;

export async function askAI(
  message: MessageDetails,
  contexts?: Contexts,
): Promise<string> {
  const response = await fetch("/api/gemini-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      contexts,
      chatSessionID: sessionStorage.getItem("chatSessionID"),
    }),
  });

  return handleJSONResponse(response);
}

export async function getFeedbackAI(code: string): Promise<string> {
  const message: MessageDetails = {
    role: CHAT_ROLES.USER,
    text: "Please analyze the code I provided and give feedback on its time and space complexity, as well as any potential improvements.",
  };

  const contexts: Contexts = {
    code: `<CODE_START>${code}</CODE_END>`,
  };

  const response = await fetch("/api/gemini-ai/code-analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, contexts }),
  });

  return handleJSONResponse(response);
}
