import { NextResponse } from "next/server";
import { getOAuth2Client, makeState } from "@/lib/google";

export async function GET() {
  const oauth2 = getOAuth2Client();
  const scopes = (process.env.GOOGLE_SCOPES ?? "").split(" ").filter(Boolean);
  const state = makeState();

  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state,
  });

  // zapisuj cookie přes response
  const res = NextResponse.redirect(url);
  res.cookies.set("g_state", state, {
    httpOnly: true,
    secure: false,     // v prod. true
    path: "/",
    maxAge: 300,       // 5 min
  });
  return res;
}
