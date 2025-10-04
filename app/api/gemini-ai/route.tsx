"server-only"

import { MessageDetails } from "@/app/components/chat/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_STUDIO_API_KEY });

const askAI = (messages: MessageDetails[], contexts?: Record<string, string>) => {
  
  return new Promise(async (resolve, reject) => {
    ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: messages.map((message) => ({ role: message.type === "question" ? "user" : "model", text: message.msg })),
      config: {
        systemInstruction:  `
          ${
            (contexts && Object.keys(contexts).length > 0) ?
              `User provided some contexts: ${Object.entries(contexts).map(([type, context], i) => `${i + 1}. Type of context: ${type}, context: ${context}\n`)}` 
              : 
              ""
          }
        `
      }
    })
    .then((res) => {
      resolve(res.text)
    })
    .catch((e) => {
      console.error('error name: ', e.name);
      console.error('error message: ', e.message);
      console.error('error status: ', e.status);
      reject(e)
    });
  }) 
};

export async function POST(req: NextRequest) {
  const { messages, contexts } = await req.json();

  const answer = await askAI(messages, contexts);

  return NextResponse.json(answer);
}
