import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE!;

export const supabaseBrowser = () =>
  createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } });

export const supabaseServer = () =>
  createClient(url, anon, { auth: { persistSession: false } });

export const supabaseAdmin = () =>
  createClient(url, service, { auth: { persistSession: false } }); // server-only (Route Handlers)
