"use client";

import { useEffect, useState, useMemo } from "react";

type CalEvent = { id?: string; summary?: string|null; start?: string|null; end?: string|null; location?: string|null; };
type Task = { id: string; title: string; due: string; priority: "low"|"medium"|"high"; done: boolean };

export default function DashboardPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/google/events").then(r=>r.json()).then(d => setEvents(d.events ?? []));
    fetch("/api/tasks/today").then(r=>r.json()).then(d => setTasks(d.tasks ?? []));
  }, []);

  const tasksDone = useMemo(() => tasks.filter(t => t.done).length, [tasks]);

  return (
    <div className="space-y-6">
      {/* 1) Projekty (zatím placeholder) */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Moje projekty</h2>
          <a href="/projects" className="text-sm underline">Vše</a>
        </div>
        <ul className="text-sm opacity-80 space-y-1">
          <li>— (zatím prázdné)</li>
        </ul>
      </section>

      {/* 2) Úkoly dnes */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Přidělené úkoly dnes</h2>
          <a href="/tasks" className="text-sm underline">Všechny úkoly</a>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm opacity-70">Na dnešek žádné úkoly.</p>
        ) : (
          <div className="space-y-2">
            <div className="text-xs opacity-70">Hotovo: {tasksDone}/{tasks.length}</div>
            <ul className="space-y-2">
              {tasks.map(t => (
                <li key={t.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className={`text-sm ${t.done ? "line-through opacity-60" : ""}`}>{t.title}</div>
                    <div className="text-xs opacity-60">
                      {new Date(t.due).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" • "}
                      {t.priority === "high" ? "Vysoká priorita" : t.priority === "medium" ? "Střední priorita" : "Nízká priorita"}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide opacity-60">{t.done ? "Done" : "Open"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3) Kalendář dnes */}
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
                {ev.location ? <span className="opacity-60"> • {ev.location}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 4) Chat teaser */}
      <section className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Chat</h2>
          <a href="/chat" className="text-sm underline">Otevřít chat</a>
        </div>
        <p className="text-sm opacity-70">— Zatím prázdné (MVP).</p>
      </section>
    </div>
  );
}
