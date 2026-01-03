// ============================================
// FILE: convex/users.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Query: Get user by Clerk ID
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

/**
 * Query: Get user by ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

/**
 * Query: Get users by organization
 */
export const getUsersByOrganization = query({
  args: { 
    organizationId: v.id("organizations"),
    role: v.optional(v.union(
      v.literal("org_admin"),
      v.literal("manager"),
      v.literal("worker")
    ))
  },
  handler: async (ctx, args) => {
    let usersQuery = ctx.db
      .query("users")
      .withIndex("by_organization", (q) => 
        q.eq("organizationId", args.organizationId)
      );

    const users = await usersQuery.collect();

    if (args.role) {
      return users.filter(user => user.role === args.role);
    }

    return users;
  },
});

/**
 * Query: Search users by name
 */
export const searchUsers = query({
  args: { 
    searchTerm: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => 
        q.search("name", args.searchTerm)
      )
      .collect();

    if (args.role) {
      return users.filter(user => user.role === args.role);
    }

    return users;
  },
});

/**
 * Mutation: Create or update user (sync with Clerk)
 */
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("super_admin"),
      v.literal("org_admin"),
      v.literal("manager"),
      v.literal("worker"),
      v.literal("customer")
    )),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        phone: args.phone,
        avatar: args.avatar,
        lastActiveAt: now,
        updatedAt: now,
      });

      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      avatar: args.avatar,
      role: args.role || "customer",
      organizationId: args.organizationId,
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        language: "en",
        currency: "NGN",
        measurementUnit: "cm",
      },
      stats: {
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        savedStyles: 0,
      },
      isActive: true,
      lastActiveAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

/**
 * Mutation: Update user profile
 */
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Update user preferences
 */
export const updateUserPreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.object({
      notifications: v.object({
        email: v.boolean(),
        push: v.boolean(),
        sms: v.boolean(),
      }),
      language: v.string(),
      currency: v.string(),
      measurementUnit: v.union(v.literal("cm"), v.literal("inches")),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      preferences: args.preferences,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Save user measurements
 */
export const saveUserMeasurements = mutation({
  args: {
    userId: v.id("users"),
    measurements: v.object({
      chest: v.optional(v.number()),
      waist: v.optional(v.number()),
      hips: v.optional(v.number()),
      shoulder: v.optional(v.number()),
      length: v.optional(v.number()),
      sleeve: v.optional(v.number()),
      neck: v.optional(v.number()),
      inseam: v.optional(v.number()),
      unit: v.union(v.literal("cm"), v.literal("inches")),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      savedMeasurements: args.measurements,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Update user stats
 */
export const updateUserStats = mutation({
  args: {
    userId: v.id("users"),
    stats: v.object({
      totalOrders: v.optional(v.number()),
      completedOrders: v.optional(v.number()),
      totalSpent: v.optional(v.number()),
      savedStyles: v.optional(v.number()),
      tasksCompleted: v.optional(v.number()),
      efficiency: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const updatedStats = {
      ...user.stats,
      ...args.stats,
    };

    await ctx.db.patch(args.userId, {
      stats: updatedStats,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});