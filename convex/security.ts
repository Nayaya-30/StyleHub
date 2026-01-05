import { v } from "convex/values";
import { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type Identity = {
  subject: string;
  iss?: string;
  email?: string;
};

export async function requireIdentity(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<Identity> {
  const ident = await ctx.auth.getUserIdentity();
  if (!ident) {
    throw new Error("Unauthorized");
  }
  return ident as Identity;
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const ident = await requireIdentity(ctx);
  const user = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", ident.subject)).first();
  if (!user) throw new Error("User not found");
  return user;
}

export function requireRole(role: string, allowed: ReadonlyArray<string>) {
  if (!allowed.includes(role)) {
    throw new Error("Forbidden");
  }
}

export function requireSameOrg(entityOrgId: string, userOrgId?: string) {
  if (!userOrgId || entityOrgId !== userOrgId) {
    throw new Error("Cross-organization access denied");
  }
}

export async function rateLimit(ctx: MutationCtx | ActionCtx, userId: Id<"users">, key: string, windowMs: number, max: number) {
  const now = Date.now();
  const windowStart = now - (now % windowMs);
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_user_and_key", (q) => q.eq("userId", userId).eq("key", key))
    .first();
  if (!existing || existing.windowStart !== windowStart) {
    if (existing) await ctx.db.delete(existing._id);
    await ctx.db.insert("rateLimits", { userId, key, windowStart, count: 1 });
    return;
  }
  if (existing.count >= max) {
    throw new Error("Rate limit exceeded");
  }
  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}

export async function audit(
  ctx: MutationCtx | ActionCtx,
  params: {
    organizationId: Id<"organizations">;
    actorId: Id<"users">;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: unknown;
  }
) {
  await ctx.db.insert("auditLogs", {
    organizationId: params.organizationId,
    actorId: params.actorId,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    metadata: params.metadata,
    createdAt: Date.now(),
  });
}

export const paginationArgs = {
  limit: v.optional(v.number()),
};
