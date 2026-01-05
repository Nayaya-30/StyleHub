import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, requireRole, rateLimit, audit } from "./security";

export const getPublicPortfolio = query({
  args: { workerId: v.optional(v.id("users")), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query("workerPortfolio")
      .withIndex("by_is_public", (ix) => ix.eq("isPublic", true))
      .order("desc");
    let items = await q.collect();
    if (args.workerId) items = items.filter((i) => i.workerId === args.workerId);
    if (args.limit) return items.slice(0, args.limit);
    return items;
  },
});

export const getWorkerPortfolio = query({
  args: { workerId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const items = await ctx.db
      .query("workerPortfolio")
      .withIndex("by_worker", (ix) => ix.eq("workerId", args.workerId))
      .order("desc")
      .collect();
    return items;
  },
});

export const addPortfolioItem = mutation({
  args: {
    workerId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    title: v.string(),
    description: v.string(),
    images: v.array(v.object({ url: v.string(), publicId: v.string(), alt: v.optional(v.string()) })),
    category: v.string(),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    isFeatured: v.boolean(),
    completedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    if (user._id !== args.workerId) requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    await rateLimit(ctx, user._id, "portfolio.add", 60_000, 10);
    const id = await ctx.db.insert("workerPortfolio", {
      workerId: args.workerId,
      orderId: args.orderId,
      title: args.title,
      description: args.description,
      images: args.images,
      category: args.category,
      tags: args.tags,
      isPublic: args.isPublic,
      isFeatured: args.isFeatured,
      stats: { views: 0, likes: 0 },
      completedAt: args.completedAt,
      createdAt: now,
      updatedAt: now,
    });
    await audit(ctx, {
      organizationId: (worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: user._id,
      action: "portfolio.add",
      targetType: "portfolioItem",
      targetId: id as unknown as string,
      metadata: { title: args.title },
    });
    return id;
  },
});

export const updatePortfolioItem = mutation({
  args: {
    itemId: v.id("workerPortfolio"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.object({ url: v.string(), publicId: v.string(), alt: v.optional(v.string()) }))),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    const worker = await ctx.db.get(item.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    if (user._id !== item.workerId) requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    const { itemId, ...updates } = args;
    await ctx.db.patch(itemId, { ...updates, updatedAt: Date.now() });
    await audit(ctx, {
      organizationId: (worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: user._id,
      action: "portfolio.update",
      targetType: "portfolioItem",
      targetId: itemId as unknown as string,
      metadata: { fields: Object.keys(updates) },
    });
    return { success: true };
  },
});

export const deletePortfolioItem = mutation({
  args: { itemId: v.id("workerPortfolio") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    const worker = await ctx.db.get(item.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    if (user._id !== item.workerId) requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    await ctx.db.delete(args.itemId);
    await audit(ctx, {
      organizationId: (worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: user._id,
      action: "portfolio.delete",
      targetType: "portfolioItem",
      targetId: args.itemId as unknown as string,
      metadata: {},
    });
    return { success: true };
  },
});
