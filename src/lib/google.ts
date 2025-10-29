// src/lib/google.ts
import { google } from "googleapis";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Vytvoří OAuth2 klienta pro Google API
 */
export const getOAuth2Client = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Missing Google OAuth env vars");
  }

  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
};

/**
 * Vytvoří bezpečný state token (HMAC) pro OAuth flow
 */
export const makeState = () => {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET!;
  if (!secret) throw new Error("Missing GOOGLE_OAUTH_STATE_SECRET");

  const nonce = crypto.randomBytes(16).toString("hex");
  const sig = crypto.createHmac("sha256", secret).update(nonce).digest("hex");

  return `${nonce}.${sig}`;
};

/**
 * Ověří platnost state tokenu z Google OAuth redirectu
 */
export const verifyState = (state: string) => {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET!;
  if (!secret) throw new Error("Missing GOOGLE_OAUTH_STATE_SECRET");

  const [nonce, sig] = state.split(".");
  if (!nonce || !sig) return false;

  const expected = crypto.createHmac("sha256", secret).update(nonce).digest("hex");
  return sig === expected;
};

/**
 * Příklad helperu na uložení OAuth tokenů do databáze přes Supabase (volitelné)
 */
export async function saveGoogleTokens(userId: string, tokens: Record<string, any>) {
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("google_tokens")
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      scope: tokens.scope,
      token_type: tokens.token_type,
    })
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to save Google tokens: ${error.message}`);
}

/**
 * Helper na získání uložených tokenů (volitelné)
 */
export async function getGoogleTokens(userId: string) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("google_tokens")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load Google tokens: ${error.message}`);
  return data;
}
