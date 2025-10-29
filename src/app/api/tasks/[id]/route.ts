import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  const body = await req.json();

  const updates: any = {};
  ["title","description","status","priority","due_date","project_id","assignee"].forEach(k => {
    if (k in body) updates[k] = body[k];
  });

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", params.id)
    .select("id,title,description,status,priority,due_date,project_id,assignee,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ task: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  const { error } = await supabase.from("tasks").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
