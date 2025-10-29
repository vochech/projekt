export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await ctx.params;
  // ... .eq("project_id", id).eq("user_id", userId)
}
