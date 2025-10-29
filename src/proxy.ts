// src/proxy.ts
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Když chybí env, neblokuj app – jen pokračuj dál.
  if (!SUPA_URL || !SUPA_ANON) {
    return NextResponse.next();
  }

  const supabase = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options) => {
        request.cookies.set({ name, value, ...options });
      },
      remove: (name: string, options) => {
        request.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    url.pathname.startsWith("/login") || url.pathname.startsWith("/auth");

  if (!user && !isAuthPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
