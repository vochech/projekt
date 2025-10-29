"use client";
import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000" },
    });
    setLoading(false);
    if (error) alert(error.message);
    else setSent(true);
  }

  return (
    <main className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-semibold">Přihlášení</h1>
      {sent ? (
        <p>Zkontroluj e-mail – poslal jsem ti odkaz pro přihlášení.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="email@domena.cz"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded px-3 py-2 border"
          >
            {loading ? "Odesílám…" : "Poslat Magic Link"}
          </button>
        </form>
      )}
    </main>
  );
}
