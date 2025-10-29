// src/app/api/projects/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// Malý helper na validaci UUID (v Supabase míváme UUID id)
const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

// GET /api/projects/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id || !isUUID(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("projects")
    .select("id,name,description,status,created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

// PATCH /api/projects/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id || !isUUID(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Povolené změny (případně si rozšiř)
  const { name, description, status } = (body as Record<string, unknown>) ?? {};
  const payload: Record<string, unknown> = {};
  if (typeof name === "string") payload.name = name;
  if (typeof description === "string") payload.description = description;
  if (typeof status === "string") payload.status = status;

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("id,name,description,status,created_at")
    .single();

  if (error) {
    // Pokud id neexistuje -> 404, jinak 500
    const notFound = /No rows|Row not found|Zero rows/.test(error.message);
    return NextResponse.json({ error: error.message }, { status: notFound ? 404 : 500 });
  }

  return NextResponse.json({ project: data });
}
