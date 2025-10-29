import { NextResponse } from "next/server";

export async function GET() {
  // jednoduchý mock – v další fázi napojíme na Supabase
  const today = new Date().toISOString().slice(0, 10);
  const tasks = [
    { id: "t1", title: "Dokončit brief pro klienta", due: `${today}T12:00:00`, priority: "high", done: false },
    { id: "t2", title: "Zapsat shrnutí z meetingu", due: `${today}T15:30:00`, priority: "medium", done: false },
    { id: "t3", title: "Odpovědět na 3 e-maily", due: `${today}T17:00:00`, priority: "low", done: true },
  ];
  return NextResponse.json({ tasks });
}
