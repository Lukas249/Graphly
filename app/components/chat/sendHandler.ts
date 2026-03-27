import { RefObject } from "react";
import { CHAT_ROLES, ChatRef, MessageDetails } from "./types";
import { AskAI } from "@/app/lib/gemini-ai/ai";

export async function sendHandler(
  chatRef: RefObject<ChatRef | null>,
  message: MessageDetails,
  askAI: AskAI,
) {
  const messageContexts = message.contexts;

  const contexts: Record<string, string> = {};

  if (messageContexts) {
    for (const [key, value] of Object.entries(messageContexts ?? {})) {
      contexts[key] = value;
    }
  }

  const answer = await askAI(message, contexts);

  chatRef.current?.addMessage({ role: CHAT_ROLES.MODEL, text: answer });
}
