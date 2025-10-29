import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getOAuth2Client, verifyState } from "@/lib/google";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // cookies() je async a Readonly → jen pro čtení
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get("g_state")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie || !verifyState(state)) {
    return NextResponse.json({ error: "Invalid state/code" }, { status: 400 });
  }

  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);

  // Supabase user z route handleru (předáváme getter na cookieStore)
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("oauth_google_tokens").upsert({
    user_id: user.id,
    access_token: tokens.access_token ?? "",
    refresh_token: tokens.refresh_token ?? "",
    scope: tokens.scope ?? "",
    token_type: tokens.token_type ?? "Bearer",
    expiry_date: new Date(tokens.expiry_date ?? Date.now() + 55 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // smaž state cookie přes response a přesměruj
  const res = NextResponse.redirect(new URL("/calendar", req.url));
  res.cookies.set("g_state", "", { path: "/", maxAge: 0 });
  return res;
}
