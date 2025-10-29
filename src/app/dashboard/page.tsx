"use client";

import { useEffect, useState } from "react";

type CalEvent = { id?: string; summary?: string|null; start?: string|null; end?: string|null; };

export default function DashboardPage() {
  const [tip, setTip] = useState<string>("");
  const [events, setEvents] = useState<CalEvent[]>([]);

  useEffect(() => {
    fetch("/api/google/events").then(r=>r.json()).then(d => setEvents(d.events ?? []));
    fetch("/api/ai/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Napiš 1 větu jako krátký pracovní tip dne (česky)." })
    }).then(r=>r.json()).then(d => setTip(d.text ?? ""));
  }, []);

  return (
    <div className="space-y-6">
      {/* řádek: tip + rychlé info */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-sm font-semibold mb-1">Tip dne</div>
          <p className="text-sm opacity-80">{tip || "…"}</p>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm font-semibold mb-1">Dnešní meetingy</div>
          <p className="text-sm opacity-80">{events.length ? `${events.length} událost(i)` : "Žádné"}</p>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm font-semibold mb-1">Rychlé akce</div>
          <div className="flex gap-2 mt-2">
            <a className="border rounded px-3 py-1 text-sm hover:bg-gray-50" href="/tasks">Moje úkoly</a>
            <a className="border rounded px-3 py-1 text-sm hover:bg-gray-50" href="/projects">Projekty</a>
          </div>
        </div>
      </section>

      {/* projekty & úkoly (placeholder) */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Moje projekty</h2>
            <a href="/projects" className="text-sm underline">Vše</a>
          </div>
          <ul className="text-sm opacity-80 space-y-1">
            <li>— (zatím prázdné)</li>
          </ul>
        </div>
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Přidělené úkoly</h2>
            <a href="/tasks" className="text-sm underline">Vše</a>
          </div>
          <ul className="text-sm opacity-80 space-y-1">
            <li>— (zatím prázdné)</li>
          </ul>
        </div>
      </section>

      {/* kalendář (dnešní přehled) */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Kalendář dnes</h2>
          <a href="/calendar" className="text-sm underline">Otevřít kalendář</a>
        </div>
        {events.length === 0 ? (
          <p className="text-sm opacity-70">Na dnešek nic.</p>
        ) : (
          <ul className="space-y-2">
            {events.map(ev => (
              <li key={ev.id} className="text-sm">
                <span className="opacity-60">{ev.start} — {ev.end}</span>{" "}
                <span className="font-medium">{ev.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* chat (placeholder) */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Chat (náhled)</h2>
          <a href="/chat" className="text-sm underline">Otevřít chat</a>
        </div>
        <p className="text-sm opacity-70">— Zatím prázdné.</p>
      </section>
    </div>
  );
}
