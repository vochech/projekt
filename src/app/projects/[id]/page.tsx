"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Project = { id:string; name:string; description?:string|null; status:string; created_at:string };
type Member = { user_id:string; role:string; joined_at:string; profiles?: { full_name?:string|null } };
type Task = { id:string; title:string; status:string; priority:string; due_date?:string|null };

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [tab, setTab] = useState<"overview"|"members"|"tasks">("overview");

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"owner"|"manager"|"member"|"viewer">("member");
  const [err, setErr] = useState("");

  async function loadAll() {
    setLoading(true);
    const [p, m, t] = await Promise.all([
      fetch(`/api/projects/${id}`).then(r=>r.json()),
      fetch(`/api/projects/${id}/members`).then(r=>r.json()),
      fetch(`/api/tasks?projectId=${id}`).then(r=>r.json())
    ]);
    setProject(p.project ?? null);
    setMembers(m.members ?? []);
    setTasks(t.tasks ?? []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, [id]);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch(`/api/projects/${id}/members`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email: inviteEmail, role: inviteRole })
    });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || "Invite failed"); return; }
    setInviteEmail(""); setInviteRole("member");
    await loadAll();
  }

  async function removeMember(user_id: string) {
    await fetch(`/api/projects/${id}/members/${user_id}`, { method: "DELETE" });
    await loadAll();
  }

  if (loading) return <div className="p-4">Načítám…</div>;
  if (!project) return <div className="p-4">Projekt nenalezen.</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">{project.name}</h1>
        {project.description ? <p className="opacity-70 text-sm">{project.description}</p> : null}
        <div className="text-xs opacity-60 mt-1">Status: {project.status}</div>
      </header>

      <nav className="flex gap-2">
        {(["overview","members","tasks"] as const).map(k => (
          <button key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1 border rounded text-sm ${tab===k ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            {k === "overview" ? "Overview" : k === "members" ? "Members" : "Tasks"}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <section className="space-y-3">
          <div className="border rounded p-4">
            <div className="font-medium mb-2">Shrnutí</div>
            <div className="text-sm opacity-70">Počet členů: {members.length}</div>
            <div className="text-sm opacity-70">Počet úkolů: {tasks.length}</div>
          </div>
        </section>
      )}

      {tab === "members" && (
        <section className="space-y-4">
          <form onSubmit={invite} className="border rounded p-4 grid md:grid-cols-4 gap-3">
            <input className="border rounded px-3 py-2 md:col-span-2" type="email"
              placeholder="email@firma.cz" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} required />
            <select className="border rounded px-3 py-2" value={inviteRole} onChange={e=>setInviteRole(e.target.value as any)}>
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
              <option value="viewer">Viewer</option>
            </select>
            <button className="border rounded px-3 py-2">Pozvat</button>
            {err && <div className="text-sm text-red-600 md:col-span-4">{err}</div>}
          </form>

          <div className="space-y-2">
            <div className="font-medium">Členové</div>
            {members.length === 0 ? (
              <p className="text-sm opacity-70">Zatím žádní členové.</p>
            ) : (
              <ul className="space-y-2">
                {members.map(m => (
                  <li key={m.user_id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.profiles?.full_name || m.user_id}</div>
                      <div className="text-xs opacity-60">Role: {m.role}</div>
                    </div>
                    <button className="text-xs border rounded px-2 py-1"
                      onClick={()=>removeMember(m.user_id)}>
                      Odebrat
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {tab === "tasks" && (
        <section className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm opacity-70">Zatím žádné úkoly v projektu.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(t => (
                <li key={t.id} className="border rounded p-3">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs opacity-60">
                    Status: {t.status} • Priority: {t.priority}
                    {t.due_date ? ` • Due: ${t.due_date}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
