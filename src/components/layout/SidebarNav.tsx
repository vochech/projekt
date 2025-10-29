"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type Item = { href: string; label: string; icon: ReactNode };


const items: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z" fill="currentColor"/></svg> },
  { href: "/projects",  label: "Projects",  icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M3 5h18v4H3zM3 11h18v8H3z" fill="currentColor"/></svg> },
  { href: "/tasks",     label: "Tasks",     icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M9 11l3 3L21 5l-2-2-7 7-3-3-2 2zM3 21h18v-2H3v2z" fill="currentColor"/></svg> },
  { href: "/calendar",  label: "Calendar",  icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M7 2v2H5a2 2 0 00-2 2v2h18V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 002 2h14a2 2 0 002-2V10z" fill="currentColor"/></svg> },
  { href: "/chat",      label: "Chat",      icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M4 4h16v10H6l-2 2V4z" fill="currentColor"/></svg> },
  { href: "/profile",   label: "Profile",   icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6z" fill="currentColor"/></svg> },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <aside className={`${open ? "w-60" : "w-16"} transition-all duration-200 border-r bg-white/80 backdrop-blur-sm h-screen sticky top-0`}>
      <div className="flex items-center justify-between px-3 h-14 border-b">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h10v2H4zm0 5h16v2H4z" fill="currentColor"/></svg>
        </button>
        {open && <span className="font-semibold text-sm">projekt</span>}
        <div className="w-8" />
      </div>

      <nav className="py-2">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/dashboard" && pathname?.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`flex items-center gap-3 px-3 py-2 mx-2 rounded
                    ${active ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <span className="shrink-0">{it.icon}</span>
                  {open && <span className="truncate">{it.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
