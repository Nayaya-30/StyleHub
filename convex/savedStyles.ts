// ============================================
// FILE: convex/savedStyles.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get saved styles for user
 */
export const getSavedStylesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
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

    return { success: true };
  },
});