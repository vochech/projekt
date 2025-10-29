import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  const { data, error } = await supabase
    .from("projects")
    .select("id,name,description,status,created_at")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ project: data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  const body = await req.json();
  const updates: any = {};
  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.status === "string") updates.status = body.status;

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", params.id)
    .select("id,name,description,status,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ project: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });

  const { error } = await supabase.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
