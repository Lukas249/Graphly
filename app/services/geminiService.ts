import "server-only";

import {
  CHAT_ROLES,
  Contexts,
  MessageDetails,
} from "@/app/components/chat/types";
import { Chat, Content, GenerateContentConfig } from "@google/genai";
import { addMessageToHistory, getChatHistory } from "./chatStorage";
import { ModelMessage, ModelResponse } from "./gemini.types";
import {
  ai,
  assistantInstructions,
  modelName,
} from "../lib/gemini-ai/geminiSetup";

export const createPrompt = (message: string, contexts?: Contexts): string => {
  return `
    <CONTEXT_START>
      ${
        contexts && Object.keys(contexts).length > 0
          ? `${Object.entries(contexts)
              .map(
                ([type, context]) =>
                  `Type of context: ${type}\n context: ${context}\n`,
              )
              .join("\n")}`
          : ""
      }
    <CONTEXT_END>
    <PROMPT_START>
      ${message}
    <PROMPT_END>
  `;
};

export const askAI = async (
  chat: Chat,
  message: MessageDetails,
  contexts?: Contexts,
): Promise<ModelResponse> => {
  const response = await chat.sendMessage({
    message: createPrompt(message.text, contexts),
  });

  const contentPart =
    response.candidates &&
    response.candidates[0] &&
    response.candidates[0].content &&
    response.candidates[0].content.parts &&
    response.candidates[0].content.parts[0];

  const text = contentPart && contentPart.text;

  if (!text) {
    throw new Error("Empty response");
  }

  return {
    text,
    thoughtSignature: contentPart.thoughtSignature,
  };
};

export function createHistory(history: ModelMessage[] = []): Content[] {
  return history.map((val) => {
    const message =
      val.role === CHAT_ROLES.USER
        ? createPrompt(val.text, val.contexts)
        : val.text;

    return {
      role: val.role,
      parts: [{ text: message, thoughtSignature: val.thoughtSignature }],
    };
  });
}

export function createChat(
  history: ModelMessage[] = [],
  config?: GenerateContentConfig | undefined,
): Chat {
  return ai.chats.create({
    model: modelName,
    history: createHistory(history),
    config,
  });
}

export async function processChatMessage(
  message: MessageDetails,
  contexts: Contexts | undefined,
  chatSessionID: string,
): Promise<string> {
  const history = await getChatHistory(chatSessionID);

  const chat = createChat(history, {
    systemInstruction: assistantInstructions,
  });

  const answer = await askAI(chat, message, contexts);

  await addMessageToHistory(chatSessionID, {
    role: CHAT_ROLES.USER,
    text: message.text,
    contexts,
  });
  await addMessageToHistory(chatSessionID, {
    role: CHAT_ROLES.MODEL,
    text: answer.text,
    thoughtSignature: answer.thoughtSignature,
  });

  return answer.text;
}
