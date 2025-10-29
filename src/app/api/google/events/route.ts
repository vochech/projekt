import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getOAuth2Client } from "@/lib/google";
import { google } from "googleapis";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: tok } = await supabase
    .from("oauth_google_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!tok) return NextResponse.json({ connected: false, events: [] });

  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({
    access_token: tok.access_token,
    refresh_token: tok.refresh_token,
    expiry_date: new Date(tok.expiry_date).getTime(),
    token_type: tok.token_type,
    scope: tok.scope,
  });

  // refresh, pokud expirováno/expiruje
  if (Date.now() > new Date(tok.expiry_date).getTime() - 60_000) {
    const { credentials } = await oauth2.refreshAccessToken();
    await supabase.from("oauth_google_tokens").update({
      access_token: credentials.access_token ?? tok.access_token,
      expiry_date: new Date(credentials.expiry_date ?? Date.now() + 55*60*1000).toISOString(),
      updated_at: new Date().toISOString()
    }).eq("user_id", user.id);
  }

  const cal = google.calendar({ version: "v3", auth: oauth2 });
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const resp = await cal.events.list({
    calendarId: "primary",
    timeMin: start,
    timeMax: end,
    singleEvents: true,
    orderBy: "startTime"
  });

  const events = (resp.data.items ?? []).map(e => ({
    id: e.id,
    summary: e.summary ?? "(bez názvu)",
    start: e.start?.dateTime ?? e.start?.date ?? null,
    end: e.end?.dateTime ?? e.end?.date ?? null,
    location: e.location ?? null
  }));

  return NextResponse.json({ connected: true, events });
}
