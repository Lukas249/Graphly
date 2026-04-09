import "server-only";

import { Contexts, MessageDetails } from "@/app/components/chat/types";
import { ModelMessage } from "./gemini.types";
import { askAI, createChat } from "./geminiService";
import { feedbackInstructions } from "../lib/gemini-ai/geminiSetup";

export async function processCodeAnalysis(
  message: MessageDetails,
  contexts: Contexts | undefined,
): Promise<string> {
  const history: ModelMessage[] = [];

  const chat = createChat(history, { systemInstruction: feedbackInstructions });

  const answer = await askAI(chat, message, contexts);

  return answer.text;
}
