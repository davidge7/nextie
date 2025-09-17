import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from 'next/server';
import type { ReviewSuggestion } from '../../../lib/types';

async function getCodeReview(code: string, language: string): Promise<ReviewSuggestion[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

  const prompt = `
    Act as an expert senior software engineer and meticulous code reviewer.
    Thoroughly analyze the following ${language} code snippet.
    Your task is to identify potential bugs, performance bottlenecks, security vulnerabilities, code smells, and deviations from established best practices.
    For each issue you find, provide a constructive, clear, and actionable feedback.
    Focus exclusively on areas that need improvement. Do not comment on code that is well-written.
    If the code is exemplary and has no issues, return an empty array.

    Here is the code to review:
    \`\`\`${language}
    ${code}
    \`\`\`
  `;

  const reviewSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        line: {
          type: Type.INTEGER,
          description: 'The line number in the code where the issue is located. Be as accurate as possible. If the issue spans multiple lines, pick the starting line.',
        },
        severity: {
          type: Type.STRING,
          description: "The severity of the issue. Must be one of: 'Critical', 'High', 'Medium', 'Low', 'Info'.",
          enum: ['Critical', 'High', 'Medium', 'Low', 'Info'],
        },
        suggestion: {
          type: Type.STRING,
          description: 'A brief, one-sentence summary of the suggested improvement. This should be a direct recommendation.',
        },
        explanation: {
          type: Type.STRING,
          description: 'A detailed explanation of why this is an issue and how the suggestion improves the code. Be clear and educational.',
        },
      },
      required: ["line", "severity", "suggestion", "explanation"],
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: reviewSchema,
      temperature: 0.2,
    }
  });
  
  const jsonText = response.text && response.text.trim();
  return jsonText && JSON.parse(jsonText) as ReviewSuggestion[] || [];
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY environment variable not set." }, { status: 500 });
  }

  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language in request body' }, { status: 400 });
    }

    const reviewResult = await getCodeReview(code, language);
    return NextResponse.json(reviewResult);

  } catch (error) {
    console.error("Error in /api/review:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: `Failed to get review from Gemini. Details: ${errorMessage}` }, { status: 500 });
  }
}
