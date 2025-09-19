import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { message, modelName } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Use streaming API
    const result = await model.generateContentStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          const errorMsg = err instanceof Error ? err.message : "Unknown stream error";
          controller.enqueue(encoder.encode(`[Error]: ${errorMsg}`));
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);

    // ✅ Forward the real error message
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Something went wrong while generating content. Please try again.",
        details: error?.response?.data || null, // forward extra details if any
      },
      { status: error?.status || 500 }
    );
  }
}
