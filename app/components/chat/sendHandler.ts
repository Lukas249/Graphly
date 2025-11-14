import { RefObject } from "react";
import { CHAT_ROLES, ChatRef, Contexts, MessageDetails } from "./types";
import { AskAI } from "@/app/lib/gemini-ai/ai";

export async function sendHandler(
  chatRef: RefObject<ChatRef | null>,
  message: MessageDetails,
  askAI: AskAI,
) {
  const chatContexts = chatRef.current?.getContexts();

  const contexts: Contexts = {};

  if (chatContexts) {
    for (const [key, value] of Object.entries(chatContexts)) {
      contexts[key] = value.text;
    }
  }

  const answer = await askAI(message, contexts);

  chatRef.current?.addMessage({ role: CHAT_ROLES.MODEL, text: answer });
}
