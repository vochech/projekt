"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

type SUser = { email?: string | null; user_metadata?: Record<string, any> };

export default function TopBarUser() {
  const router = useRouter();
  const [user, setUser] = useState<SUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();

    // načti session uživatele
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // aktualizuj při změně stavu
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function logout() {
    const sb = supabaseBrowser();
    await sb.auth.signOut();
    setOpen(false);
    router.replace("/login");
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
      >
        Přihlásit se
      </a>
    );
  }

  const name =
    (user.user_metadata?.full_name as string) ||
    (user.email?.split("@")[0] ?? "user");
  const initials =
    (user.user_metadata?.full_name as string)
      ?.split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || (user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-sm">
          {initials}
        </div>
        <span className="hidden md:block text-sm">{name}</span>
        <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded border bg-white shadow-sm z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <a href="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">
            Profile
          </a>
          <a href="/projects" className="block px-3 py-2 text-sm hover:bg-gray-50">
            Projects
          </a>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
