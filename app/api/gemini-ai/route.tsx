import {GoogleGenAI} from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(
  req: NextRequest
) {
    const { question } = await req.json()
    
    const GOOGLE_AI_STUDIO_API_KEY = process.env.GOOGLE_AI_STUDIO_API_KEY;
    const ai = new GoogleGenAI({apiKey: GOOGLE_AI_STUDIO_API_KEY});

    const askAI = async (question: string) => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: question,
        });
        console.log(response)
        return response.text
    }

    const answer = await askAI(question)
   
    return NextResponse.json(answer)
}