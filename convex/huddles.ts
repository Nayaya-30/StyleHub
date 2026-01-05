import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, rateLimit, audit } from "./security";

export const getHuddlesByOrder = query({
  args: { orderId: v.id("orders"), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    requireSameOrg(order.organizationId as Id<"organizations">, user.organizationId);
    const base = ctx.db
      .query("huddles")
      .withIndex("by_order", (ix) => ix.eq("orderId", args.orderId))
      .order("desc");
    const items = await base.collect();
    if (args.status) return items.filter((h) => h.status === args.status);
    return items;
  },
});

export const createHuddle = mutation({
  args: { roomName: v.string(), orderId: v.optional(v.id("orders")), participants: v.array(v.id("users")), startedBy: v.id("users"), type: v.union(v.literal("audio"), v.literal("video")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    if (user._id !== args.startedBy) throw new Error("Forbidden");
    if (args.orderId) {
      const order = await ctx.db.get(args.orderId);
      if (!order) throw new Error("Order not found");
      requireSameOrg(order.organizationId as Id<"organizations">, user.organizationId);
    }
    await rateLimit(ctx, user._id, "huddle.create", 60_000, 3);
    const id = await ctx.db.insert("huddles", {
      roomName: args.roomName,
      orderId: args.orderId,
      participants: args.participants,
      startedBy: args.startedBy,
      type: args.type,
      status: "active",
      duration: undefined,
      startedAt: now,
      endedAt: undefined,
    });
    await audit(ctx, {
      organizationId: (args.orderId ? (await ctx.db.get(args.orderId))!.organizationId : user.organizationId!) as Id<"organizations">,
      actorId: user._id,
      action: "huddle.create",
      targetType: "huddle",
      targetId: id as unknown as string,
      metadata: { type: args.type },
    });
    return id;
  },
});

export const endHuddle = mutation({
  args: { huddleId: v.id("huddles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const h = await ctx.db.get(args.huddleId);
    if (!h) throw new Error("Huddle not found");
    // allow participant or admin
    const isParticipant = h.participants.some((p) => p === user._id);
    const role = user.role;
    if (!isParticipant && !(role === "org_admin" || role === "manager" || role === "super_admin")) {
      throw new Error("Forbidden");
    }
    const now = Date.now();
    const duration = h.startedAt ? now - h.startedAt : undefined;
    await ctx.db.patch(args.huddleId, { status: "ended", duration, endedAt: now });
    await audit(ctx, {
      organizationId: (h.orderId ? (await ctx.db.get(h.orderId))!.organizationId : user.organizationId!) as Id<"organizations">,
      actorId: user._id,
      action: "huddle.end",
      targetType: "huddle",
      targetId: args.huddleId as unknown as string,
      metadata: { duration },
    });
    return { success: true };
  },
});
