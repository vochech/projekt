export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/projects/[id]
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.includes("[")) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("projects")
    .select("id,name,description,status,created_at")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ project: data });
}

// PATCH /api/projects/[id]
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.includes("[")) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  // auth check (navíc k RLS)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, any> = {};
  if ("name" in body) updates.name = body.name?.trim();
  if ("description" in body) updates.description = body.description?.trim() ?? null;
  if ("status" in body) updates.status = body.status;

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select("id,name,description,status,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ project: data });
}

// DELETE /api/projects/[id]
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id || id.includes("[")) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
