"use client";
import { useEffect, useState } from "react";

type Ev = { id?: string; summary?: string | null; start?: string | null; end?: string | null; location?: string | null; };

export default function CalendarPage() {
  const [data, setData] = useState<{connected:boolean; events:Ev[]}>({connected:false, events:[]});

  useEffect(() => {
    fetch("/api/google/events").then(r=>r.json()).then(setData);
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dnešní kalendář</h1>

      {!data.connected ? (
        <a className="inline-block border rounded px-3 py-2 underline" href="/api/google/init">
          Připojit Google Calendar
        </a>
      ) : data.events.length === 0 ? (
        <p>Na dnešek nic v kalendáři.</p>
      ) : (
        <ul className="space-y-2">
          {data.events.map(ev => (
            <li key={ev.id} className="border rounded p-3">
              <div className="font-medium">{ev.summary}</div>
              <div className="text-sm opacity-80">
                {ev.start} — {ev.end}{ev.location ? ` • ${ev.location}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
