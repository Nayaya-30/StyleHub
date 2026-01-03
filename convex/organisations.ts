// ============================================
// FILE: convex/organizations.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get organization by ID
 */
export const getOrganizationById = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    return organization;
  },
});

/**
 * Query: Get organization by slug
 */
export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return organization;
  },
});

/**
 * Query: Get organization by Clerk org ID
 */
export const getOrganizationByClerkId = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args) => {
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => 
        q.eq("clerkOrgId", args.clerkOrgId)
      )
      .first();

    return organization;
  },
});

/**
 * Query: Get all active organizations
 */
export const getActiveOrganizations = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("organizations")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

/**
 * Query: Search organizations
 */
export const searchOrganizations = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const organizations = await ctx.db
      .query("organizations")
      .withSearchIndex("search_name", (q) => 
        q.search("name", args.searchTerm).eq("isActive", true)
      )
      .collect();

    return organizations;
  },
});

/**
 * Mutation: Create organization
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    clerkOrgId: v.string(),
    tagline: v.optional(v.string()),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if slug is unique
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingOrg) {
      throw new Error("Organization slug already exists");
    }

    const now = Date.now();

    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      address: args.address,
      phone: args.phone,
      email: args.email,
      clerkOrgId: args.clerkOrgId,
      tagline: args.tagline,
      logo: args.logo,
      settings: {
        basePrice: 0,
        customizationFeeRange: { min: 0, max: 10000 },
        allowNegotiation: true,
        progressStages: ["cutting", "sewing", "finishing"],
        deliveryFee: 0,
        currency: "NGN",
      },
      stats: {
        totalDesigns: 0,
        completedOrders: 0,
        averageRating: 0,
        totalReviews: 0,
        responseTime: 0,
      },
      badges: [],
      isActive: true,
      isPremium: false,
      verified: false,
      createdAt: now,
      updatedAt: now,
    });

    return organizationId;
  },
});

/**
 * Mutation: Update organization
 */
export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    tagline: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    logo: v.optional(v.string()),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, ...updates } = args;

    await ctx.db.patch(organizationId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Update organization settings
 */
export const updateOrganizationSettings = mutation({
  args: {
    organizationId: v.id("organizations"),
    settings: v.object({
      basePrice: v.number(),
      customizationFeeRange: v.object({
        min: v.number(),
        max: v.number(),
      }),
      allowNegotiation: v.boolean(),
      progressStages: v.array(v.string()),
      deliveryFee: v.number(),
      currency: v.string(),
      businessHours: v.optional(
        v.object({
          monday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          tuesday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          wednesday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          thursday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          friday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          saturday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
          sunday: v.object({ 
            open: v.string(), 
            close: v.string(), 
            closed: v.boolean() 
          }),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.organizationId, {
      settings: args.settings,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Update organization stats
 */
export const updateOrganizationStats = mutation({
  args: {
    organizationId: v.id("organizations"),
    stats: v.object({
      totalDesigns: v.optional(v.number()),
      completedOrders: v.optional(v.number()),
      averageRating: v.optional(v.number()),
      totalReviews: v.optional(v.number()),
      responseTime: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    const updatedStats = {
      ...org.stats,
      ...args.stats,
    };

    await ctx.db.patch(args.organizationId, {
      stats: updatedStats,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Toggle organization active status
 */
export const toggleOrganizationStatus = mutation({
  args: {
    organizationId: v.id("organizations"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.organizationId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});