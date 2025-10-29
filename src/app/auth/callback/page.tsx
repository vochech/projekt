"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      // Vymění kód z magic linku za session a uloží cookie
      const { error } = await sb.auth.exchangeCodeForSession(window.location.href);
      // Ignoruj chybu typu "No code found" při opakovaném vstupu
      router.replace("/dashboard");
    })();
  }, [router]);

  return <div className="p-6">Přihlašuji…</div>;
}
