import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "Buď extrémně stručný, praktický a konkrétní. Odpověď max. 1–2 věty česky." },
        { role: "user", content: "Napiš krátký pracovní tip dne pro zaměstnance ve firmě (zaměř se na soustředění a dokončení jednoho důležitého úkolu)." }
      ]
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ tip: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
