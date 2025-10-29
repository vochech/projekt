// PŮVODNĚ (špatně):
// export async function GET(_req: Request, ctx: { params: Promise<{ id: string; userId: string }> }) { ... }
export const runtime = "nodejs";

// SPRÁVNĚ:
export async function GET(_req: Request, { params }: { params: { id: string; userId: string } }) {
  const { id, userId } = params;
  // ... zbytek tvého původního kódu ...
}

export async function PATCH(req: Request, { params }: { params: { id: string; userId: string } }) {
  const { id, userId } = params;
  // ... zbytek tvého původního kódu ...
}

export async function DELETE(_req: Request, { params }: { params: { id: string; userId: string } }) {
  const { id, userId } = params;
  // ... zbytek tvého původního kódu ...
}
