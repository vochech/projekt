"use client";
import { useState } from "react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("Napiš 1 větu, proč mám dnes dokončit hlavní úkol.");
  const [res, setRes] = useState<string>("");

  async function send() {
    setRes("…");
    const r = await fetch("/api/ai/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await r.json();
    setRes(data.text || data.error || "");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI test</h1>
      <textarea
        className="w-full border rounded p-3 h-28"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex gap-3">
        <button onClick={send} className="border rounded px-3 py-2">Odeslat</button>
        <a className="underline" href="/">Domů</a>
      </div>
      {res && <pre className="border rounded p-3 whitespace-pre-wrap">{res}</pre>}
    </main>
  );
}
