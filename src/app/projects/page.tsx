"use client";
import { useEffect, useState } from "react";

type Project = { id: string; name: string; description?: string | null; status: string; created_at: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  async function load() {
    const r = await fetch("/api/projects");
    const d = await r.json();
    setProjects(d.projects ?? []);
  }

  useEffect(() => { load(); }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const r = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setErr(d.error || "Chyba"); return; }
    setName(""); setDescription("");
    await load();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Projects</h1>

      <form onSubmit={createProject} className="border rounded p-4 space-y-3">
        <div className="font-medium">Nový projekt</div>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Název projektu"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Popis (volitelné)"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button disabled={loading} className="border rounded px-3 py-2">
          {loading ? "Vytvářím…" : "Vytvořit"}
        </button>
      </form>

      <section className="space-y-2">
        <div className="font-medium">Moje projekty</div>
        {projects.length === 0 ? (
          <p className="text-sm opacity-70">Zatím žádné projekty.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map(p => (
              <li key={p.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    {p.description ? (
                      <div className="text-sm opacity-70">{p.description}</div>
                    ) : null}
                    <div className="text-xs opacity-60 mt-1">
                      Status: {p.status} • {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                  <a className="text-sm underline" href={`/projects/${p.id}`}>Otevřít</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
