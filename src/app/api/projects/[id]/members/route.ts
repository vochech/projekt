// PŮVODNĚ (špatně):
// export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) { ... }
export const runtime = "nodejs";

// SPRÁVNĚ (nahraď hlavičku):
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // ... zbytek tvého původního kódu ...
}

// Pokud máš i POST/PATCH/DELETE v tomhle souboru, uprav je stejně:
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // ... zbytek tvého původního kódu ...
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // ... zbytek tvého původního kódu ...
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // ... zbytek tvého původního kódu ...
}
