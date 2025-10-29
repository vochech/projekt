import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // bezpečné pro serverové volání

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise assistant. Reply briefly." },
        { role: "user", content: prompt ?? "Ahoj! Napiš krátký pozdrav." },
      ],
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
