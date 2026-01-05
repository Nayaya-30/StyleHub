// ============================================
// FILE: convex/savedStyles.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, rateLimit, audit } from "./security";

/**
 * Query: Get saved styles for user
 */
export const getSavedStylesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found");
    requireSameOrg((target.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const savedStyles = await ctx.db
      .query("savedStyles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return savedStyles;
  },
});

/**
 * Query: Check if style is saved
 */
export const isStyleSaved = query({
  args: {
    userId: v.id("users"),
    styleId: v.id("styles"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found");
    requireSameOrg((target.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const saved = await ctx.db
      .query("savedStyles")
      .withIndex("by_user_and_style", (q) => 
        q.eq("userId", args.userId).eq("styleId", args.styleId)
      )
      .first();

    return !!saved;
  },
});

/**
 * Mutation: Save style
 */
export const saveStyle = mutation({
  args: {
    userId: v.id("users"),
    styleId: v.id("styles"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await getCurrentUser(ctx);
    if (actor._id !== args.userId) {
      const target = await ctx.db.get(args.userId);
      if (!target) throw new Error("User not found");
      requireSameOrg((target.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), actor.organizationId);
    }
    await rateLimit(ctx, actor._id, "style.save", 60000, 50);
    // Check if already saved
    const existing = await ctx.db
      .query("savedStyles")
      .withIndex("by_user_and_style", (q) => 
        q.eq("userId", args.userId).eq("styleId", args.styleId)
      )
      .first();

    if (existing) {
      throw new Error("Style already saved");
    }

    const savedStyleId = await ctx.db.insert("savedStyles", {
      userId: args.userId,
      styleId: args.styleId,
      notes: args.notes,
      createdAt: Date.now(),
    });

    // Update style stats
    const style = await ctx.db.get(args.styleId);
    if (style) {
      await ctx.db.patch(args.styleId, {
        stats: {
          ...style.stats,
          likes: style.stats.likes + 1,
        },
        updatedAt: Date.now(),
      });
    }

    // Update user stats
    const user = await ctx.db.get(args.userId);
    if (user && user.stats) {
      await ctx.db.patch(args.userId, {
        stats: {
          ...user.stats,
          savedStyles: user.stats.savedStyles + 1,
        },
        updatedAt: Date.now(),
      });
    }

    await audit(ctx, {
      organizationId: (actor.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: actor._id,
      action: "style.save",
      targetType: "style",
      targetId: args.styleId as unknown as string,
    });
    return savedStyleId;
  },
});

/**
 * Mutation: Unsave style
 */
export const unsaveStyle = mutation({
  args: {
    userId: v.id("users"),
    styleId: v.id("styles"),
  },
  handler: async (ctx, args) => {
    const actor = await getCurrentUser(ctx);
    if (actor._id !== args.userId) {
      const target = await ctx.db.get(args.userId);
      if (!target) throw new Error("User not found");
      requireSameOrg((target.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), actor.organizationId);
    }
    await rateLimit(ctx, actor._id, "style.unsave", 60000, 50);
    const saved = await ctx.db
      .query("savedStyles")
      .withIndex("by_user_and_style", (q) => 
        q.eq("userId", args.userId).eq("styleId", args.styleId)
      )
      .first();

    if (!saved) {
      throw new Error("Style not saved");
    }

    await ctx.db.delete(saved._id);

    // Update style stats
    const style = await ctx.db.get(args.styleId);
    if (style) {
      await ctx.db.patch(args.styleId, {
        stats: {
          ...style.stats,
          likes: Math.max(0, style.stats.likes - 1),
        },
        updatedAt: Date.now(),
      });
    }

    // Update user stats
    const user = await ctx.db.get(args.userId);
    if (user && user.stats) {
      await ctx.db.patch(args.userId, {
        stats: {
          ...user.stats,
          savedStyles: Math.max(0, user.stats.savedStyles - 1),
        },
        updatedAt: Date.now(),
      });
    }

    await audit(ctx, {
      organizationId: (actor.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: actor._id,
      action: "style.unsave",
      targetType: "style",
      targetId: args.styleId as unknown as string,
    });
    return { success: true };
  },
});
