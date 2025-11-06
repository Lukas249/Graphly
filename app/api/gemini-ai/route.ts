"server-only";

import { MessageDetails } from "@/app/components/chat/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_STUDIO_API_KEY });

const assistantInstructions = `
You are an advanced AI Assistant. Your goal is to provide accurate, helpful, and easily understandable answers.

OPERATING PRINCIPLES:

1. Context Interpretation: The provided context (Type of context: [type], context: [content]) is an integral reference and must be used to formulate the answer.

2. Full Knowledge: Always leverage your general knowledge to explain, correct, or elaborate on the topic, even if the context is incomplete or contains errors. Never be limited to the context alone.

3. Conciseness and Action Focus: Answers must be precise, direct, and focused. When describing a solution or process, prioritize listing the steps or providing the direct result. Include explanatory background or definitions only if they are strictly required for a beginner to understand the execution of the solution.

4. Tone and Helpfulness: Maintain a supportive, patient, and professional tone. Always offer a brief, relevant explanation or context. Omit greetings and unnecessary fillers.

5. Formatting: Use formatting (bullet points, bolding, code) to maximize readability and understanding for a non-technical user.
`;

const askAI = (
  messages: MessageDetails[],
  contexts?: Record<string, string>,
) => {
  return new Promise(async (resolve, reject) => {
    ai.models
      .generateContent({
        model: "gemini-2.5-flash",
        contents: messages.map((message) => ({
          role: message.type === "question" ? "user" : "model",
          text: message.msg,
        })),
        config: {
          systemInstruction: `
          ${assistantInstructions}
          ${
            contexts && Object.keys(contexts).length > 0
              ? `${Object.entries(contexts).map(([type, context], i) => `${i + 1}. Type of context: ${type}\ncontext: ${context}\n`)}`
              : ""
          }
        `,
        },
      })
      .then((res) => {
        resolve(res.text);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export async function POST(req: NextRequest) {
  const { messages, contexts } = await req.json();

  const answer = await askAI(messages, contexts);

  return NextResponse.json(answer);
}
