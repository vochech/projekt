"use client";
import { useEffect, useState } from "react";

type Task = {
  id: string; title: string; description?: string|null;
  status: "open"|"in_progress"|"done";
  priority: "low"|"medium"|"high";
  due_date?: string|null; project_id?: string|null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [priority, setPriority] = useState<"low"|"medium"|"high">("medium");
  const [due, setDue] = useState<string>("");

  async function load() {
    const r = await fetch("/api/tasks");
    const d = await r.json();
    setTasks(d.tasks ?? []);
  }
  useEffect(() => { load(); }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        project_id: projectId || null,
        priority,
        due_date: due || null
      })
    });
    if (r.ok) {
      setTitle(""); setProjectId(""); setPriority("medium"); setDue("");
      await load();
    }
  }

  async function setStatus(id: string, status: Task["status"]) {
    await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ status }) });
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Tasks</h1>

      <form onSubmit={createTask} className="border rounded p-4 grid gap-3 md:grid-cols-4">
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Název úkolu" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="border rounded px-3 py-2" placeholder="Project ID (volitelné)" value={projectId} onChange={e=>setProjectId(e.target.value)} />
        <select className="border rounded px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value as any)}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input type="date" className="border rounded px-3 py-2 md:col-span-2" value={due} onChange={e=>setDue(e.target.value)} />
        <button className="border rounded px-3 py-2 md:col-span-2">Přidat</button>
      </form>

      <section className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-sm opacity-70">Zatím žádné úkoly.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map(t => (
              <li key={t.id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-60">
                    {t.project_id ? `Project: ${t.project_id} • ` : ""}
                    Priority: {t.priority} • Status: {t.status}
                    {t.due_date ? ` • Due: ${t.due_date}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs border rounded px-2 py-1" onClick={()=>setStatus(t.id, "open")}>Open</button>
                  <button className="text-xs border rounded px-2 py-1" onClick={()=>setStatus(t.id, "in_progress")}>Doing</button>
                  <button className="text-xs border rounded px-2 py-1" onClick={()=>setStatus(t.id, "done")}>Done</button>
                  <button className="text-xs border rounded px-2 py-1" onClick={()=>remove(t.id)}>Smazat</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
