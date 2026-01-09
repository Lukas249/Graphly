"use server";

import {
  CHAT_ROLES,
  Contexts,
  MessageDetails,
} from "@/app/components/chat/types";
import { Chat, Content, GoogleGenAI } from "@google/genai";
import { addMessageToHistory, getChatHistory } from "./chatStorage";
import { ModelMessage, ModelResponse } from "./gemini.types";

const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_STUDIO_API_KEY });
const modelName = process.env.GOOGLE_AI_STUDIO_MODEL_NAME || "gemini-2.5-flash";

const assistantInstructions = `
You are an advanced AI Assistant. Your goal is to provide accurate, helpful, and easily understandable answers.

OPERATING PRINCIPLES:

1. INPUT STRUCTURE: The user query is enclosed by <PROMPT_START> and <PROMPT_END>. All context data is enclosed by <CONTEXT_START> and <CONTEXT_END>.

2. CONTEXT MANDATE (Applicability): Utilize the context within <CONTEXT_START> ONLY IF the user's query within <PROMPT_START> is thematically relevant to the content or constraints.

3. Full Knowledge: Always leverage your general knowledge to explain, correct, or elaborate on the topic, even if the context is incomplete or contains errors. Never be limited to the context alone.

4. Conciseness and Action Focus: Answers must be precise, direct, and focused. When describing a solution or process, prioritize listing the steps or providing the direct result. Include explanatory background or definitions only if they are strictly required for a beginner to understand the execution of the solution.

5. Tone and Helpfulness: Maintain a supportive, patient, and professional tone. Always offer a brief, relevant explanation or context. Omit greetings and unnecessary fillers.

6. Formatting: Use formatting (bullet points, bolding, code) to maximize readability and understanding for a non-technical user.

CONTEXT FORMAT WITHIN <CONTEXT_START> AND <CONTEXT_END> IS LIKE: Type of context: [type]\n context: [content]\n
`;

const createPrompt = (message: string, contexts?: Contexts): string => {
  return `
    <CONTEXT_START>
      ${
        contexts && Object.keys(contexts).length > 0
          ? `${Object.entries(contexts).map(([type, context]) => `Type of context: ${type}\n context: ${context}\n`)}`
          : ""
      }
    <CONTEXT_END>
    <PROMPT_START>
      ${message}
    <PROMPT_END>
  `;
};

const askAI = async (
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

function createHistory(history: ModelMessage[] = []): Content[] {
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

function createChat(history: ModelMessage[] = []): Chat {
  return ai.chats.create({
    model: modelName,
    history: createHistory(history),
    config: {
      systemInstruction: assistantInstructions,
      temperature: 1,
    },
  });
}

export async function processChatMessage(
  message: MessageDetails,
  contexts: Contexts | undefined,
  chatSessionID: string,
): Promise<string> {
  const history = await getChatHistory(chatSessionID);

  const chat = createChat(history);

  const answer = await askAI(chat, message, contexts);

  addMessageToHistory(chatSessionID, {
    role: CHAT_ROLES.USER,
    text: message.text,
    contexts,
  });
  addMessageToHistory(chatSessionID, {
    role: CHAT_ROLES.MODEL,
    text: answer.text,
    thoughtSignature: answer.thoughtSignature,
  });

  return answer.text;
}
