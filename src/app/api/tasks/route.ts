import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const onlyToday = url.searchParams.get("today") === "1";

  let q = supabase.from("tasks")
    .select("id,title,description,status,priority,due_date,project_id,assignee,created_at")
    .order("created_at", { ascending: false });

  if (projectId) q = q.eq("project_id", projectId);
  if (onlyToday) q = q.eq("due_date", new Date().toISOString().slice(0,10));

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks: data ?? [] });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, project_id, priority, due_date } = body;
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: title.trim(),
      description: description?.trim() ?? null,
      project_id: project_id || null,
      priority: priority ?? "medium",
      due_date: due_date ?? null,
      created_by: user.id
    })
    .select("id,title,description,status,priority,due_date,project_id,assignee,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ task: data });
}
