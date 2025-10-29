// src/lib/supabaseClient.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function supabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ZPĚTNÁ KOMPATIBILITA: starý název zůstává funkční
export const supabaseBrowser = supabaseClient;
