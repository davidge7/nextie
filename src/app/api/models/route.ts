import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error("Error listing models:", await resp.text());
      return NextResponse.json({ error: "Failed to fetch models" }, { status: resp.status });
    }

    const data = await resp.json();
    const allModels = data.models || [];  // the field is likely `models`
    const creatableModels = allModels.filter((model: { supportedGenerationMethods: string | string[]; }) =>
      model.supportedGenerationMethods?.includes('generateContent')
    );

    return NextResponse.json(creatableModels.map((model: any) => ({
      name: model.name,
      displayName: model.displayName || model.name,
      description: model.description,
      inputTokenLimit: model.inputTokenLimit,
      outputTokenLimit: model.outputTokenLimit,
    })));
  } catch (error) {
    console.error('List Models API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching models' },
      { status: 500 }
    );
  }
}
