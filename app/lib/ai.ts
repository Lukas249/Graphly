import { MessageDetails } from "../components/chat/types";

export type AskAI = (
  messages: MessageDetails[],
  contexts?: Record<string, string>,
) => Promise<string>;

export async function askAI(
  messages: MessageDetails[],
  contexts?: Record<string, string>,
): Promise<string> {
  const response = await fetch("/api/gemini-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, contexts }),
  });

  return await response.json();
}
