export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // ... zbytek beze změn, jen .eq("project_id", id)
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // ... zbytek beze změn, jen upsert({ project_id: id, ... })
}
