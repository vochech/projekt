"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  // pokud je už session aktivní, přesměruj na dashboard
  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.getSession();
      if (data.session) router.replace("/dashboard");
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Zadej platný e-mail.");
      return;
    }

    try {
      setLoading(true);
      const sb = supabaseBrowser();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await sb.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: redirectTo },
      });

      if (error) setErr(error.message);
      else setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-semibold">Přihlášení</h1>

      {sent ? (
        <p className="text-sm">
          Odesláno. Zkontroluj e-mail a klikni na odkaz pro přihlášení.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="email@domena.cz"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded px-3 py-2 border"
          >
            {loading ? "Odesílám…" : "Poslat magic link"}
          </button>
        </form>
      )}
    </main>
  );
}
