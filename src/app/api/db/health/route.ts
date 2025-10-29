import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseClient";

export async function GET() {
  try {
    const sb = supabaseAdmin();
    // jednoduché ověření – dotaz na počet řádků v profiles
    const { count, error } = await sb
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ ok: true, table: "profiles", rows: count ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
