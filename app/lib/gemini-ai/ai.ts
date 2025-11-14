import {
  CHAT_ROLES,
  Contexts,
  MessageDetails,
} from "../../components/chat/types";
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

export async function getFeedbackAI(contexts: Contexts): Promise<string> {
  const messages: MessageDetails[] = [
    {
      role: CHAT_ROLES.USER,
      text: `
You are an automated code review assistant. Your task is to generate concise feedback for a user's code submission.

Rules:

Format: Deliver the feedback as a single, smooth-flowing paragraph of plain markdown text. Do not use introductions, titles, headings, or bullet points.

Complexity: Must state the Time Complexity and Space Complexity in a natural, grammatically correct sentence.

Suggestion: Only include a brief, meaningful improvement suggestion if the code clearly needs one.

Conciseness: If no improvement is needed, your output must stop immediately after stating the complexities, with absolutely no additional filler or sign-off text.`,
    },
  ];

  const response = await fetch("/api/gemini-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, contexts }),
  });

  return await response.json();
}
