import { RefObject } from "react";
import { ChatRef } from "./chat";
import { MessageDetails } from "./types";
import { AskAI } from "@/app/lib/ai";

export async function sendHandler(
  chatRef: RefObject<ChatRef | null>,
  messages: MessageDetails[],
  askAI: AskAI,
) {
  const chatContexts = chatRef.current?.getContexts();

  const contexts: Record<string, string> = {};

  if (chatContexts) {
    for (const [key, value] of Object.entries(chatContexts)) {
      contexts[key] = value.text;
    }
  }

  const answer = await askAI(messages, contexts);
  chatRef.current?.addMessage({ type: "response", msg: answer });
}
