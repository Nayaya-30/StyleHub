// ============================================
// FILE: convex/styles.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get style by ID
 */
export const getStyleById = query({
	args: { styleId: v.id("styles") },
	handler: async (ctx, args) => {
		const style = await ctx.db.get(args.styleId);
		return style;
	},
});

/**
 * Query: Get styles by organization
 */
export const getStylesByOrganization = query({
	args: {
		organizationId: v.id("organizations"),
		isActive: v.optional(v.boolean()),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		let query = ctx.db
			.query("styles")
			.withIndex("by_organization", (q) =>
				q.eq("organizationId", args.organizationId)
			)
			.order("desc");

		const styles = await query.collect();

		let filtered = styles;
		if (args.isActive !== undefined) {
			filtered = styles.filter(s => s.isActive === args.isActive);
		}

		if (args.limit) {
			return filtered.slice(0, args.limit);
		}

		return filtered;
	},
});

/**
 * Query: Get featured styles
 */
export const getFeaturedStyles = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const query = ctx.db
			.query("styles")
			.withIndex("by_featured", (q) => q.eq("isFeatured", true))
			.order("desc");

		if (args.limit) {
			return await query.take(args.limit);
		}

		return await query.collect();
	},
});

/**
 * Query: Get styles by category
 */
export const getStylesByCategory = query({
	args: {
		category: v.string(),
		gender: v.optional(v.union(
			v.literal("men"),
			v.literal("women"),
			v.literal("kids"),
			v.literal("unisex")
		)),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const query = ctx.db
			.query("styles")
			.withIndex("by_category", (q) => q.eq("category", args.category))
			.filter((q) => q.eq(q.field("isActive"), true))
			.order("desc");

		const styles = await query.collect();

		let filtered = styles;
		if (args.gender) {
			filtered = styles.filter(s => s.gender === args.gender);
		}

		if (args.limit) {
			return filtered.slice(0, args.limit);
		}

		return filtered;
	},
});

/**
 * Query: Search styles
 */
export const searchStyles = query({
	args: {
		searchTerm: v.string(),
		category: v.optional(v.string()),
		gender: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		let stylesQuery = ctx.db
			.query("styles")
			.withSearchIndex("search_title", (q) => {
				let search = q.search("title", args.searchTerm);
				if (args.category) {
					search = search.eq("category", args.category);
				}
				if (args.gender) {
					search = search.eq("gender", args.gender);
				}
				return search.eq("isActive", true);
			});

		const styles = await stylesQuery.collect();
		return styles;
	},
});

/**
 * Query: Get all active styles with filters
 */
export const getActiveStyles = query({
	args: {
		category: v.optional(v.string()),
		gender: v.optional(v.string()),
		minPrice: v.optional(v.number()),
		maxPrice: v.optional(v.number()),
		organizationId: v.optional(v.id("organizations")),
		limit: v.optional(v.number()),
		sortBy: v.optional(v.union(
			v.literal("newest"),
			v.literal("popular"),
			v.literal("price-low"),
			v.literal("price-high")
		)),
	},
	handler: async (ctx, args) => {
		const query = ctx.db
			.query("styles")
			.withIndex("by_active", (q) => q.eq("isActive", true));

		let styles = await query.collect();

		// Apply filters
		if (args.category) {
			styles = styles.filter(s => s.category === args.category);
		}
		if (args.gender) {
			styles = styles.filter(s => s.gender === args.gender);
		}
		if (args.minPrice !== undefined) {
			styles = styles.filter(s => s.basePrice >= args.minPrice!);
		}
		if (args.maxPrice !== undefined) {
			styles = styles.filter(s => s.basePrice <= args.maxPrice!);
		}
		if (args.organizationId) {
			styles = styles.filter(s => s.organizationId === args.organizationId);
		}

		// Sort
		if (args.sortBy) {
			switch (args.sortBy) {
				case "newest":
					styles.sort((a, b) => b.createdAt - a.createdAt);
					break;
				case "popular":
					styles.sort((a, b) => b.stats.orders - a.stats.orders);
					break;
				case "price-low":
					styles.sort((a, b) => a.basePrice - b.basePrice);
					break;
				case "price-high":
					styles.sort((a, b) => b.basePrice - a.basePrice);
					break;
			}
		}

		if (args.limit) {
			return styles.slice(0, args.limit);
		}

		return styles;
	},
});

/**
 * Mutation: Create style
 */
export const createStyle = mutation({
	args: {
		organizationId: v.id("organizations"),
		title: v.string(),
		description: v.string(),
		category: v.string(),
		subCategory: v.string(),
		gender: v.union(
			v.literal("men"),
			v.literal("women"),
			v.literal("kids"),
			v.literal("unisex")
		),
		images: v.array(v.object({
			url: v.string(),
			publicId: v.string(),
			width: v.number(),
			height: v.number(),
			alt: v.optional(v.string()),
		})),
		basePrice: v.number(),
		currency: v.string(),
		isNegotiable: v.boolean(),
		tags: v.array(v.string()),
		measurements: v.object({
			required: v.array(v.string()),
			optional: v.array(v.string()),
		}),
		createdBy: v.id("users"),
	},
	handler: async (ctx, args) => {
		const now = Date.now();

		const styleId = await ctx.db.insert("styles", {
			...args,
			videos: undefined,
			customizationOptions: undefined,
			isActive: true,
			isFeatured: false,
			stats: {
				views: 0,
				likes: 0,
				orders: 0,
				shares: 0,
			},
			seo: undefined,
			createdAt: now,
			updatedAt: now,
		});

		// Update organization stats
		const org = await ctx.db.get(args.organizationId);
		if (org) {
			await ctx.db.patch(args.organizationId, {
				stats: {
					...org.stats,
					totalDesigns: org.stats.totalDesigns + 1,
				},
				updatedAt: now,
			});
		}

		return styleId;
	},
});

/**
 * Mutation: Update style
 */
export const updateStyle = mutation({
	args: {
		styleId: v.id("styles"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		category: v.optional(v.string()),
		subCategory: v.optional(v.string()),
		gender: v.optional(v.union(
			v.literal("men"),
			v.literal("women"),
			v.literal("kids"),
			v.literal("unisex")
		)),
		basePrice: v.optional(v.number()),
		isNegotiable: v.optional(v.boolean()),
		tags: v.optional(v.array(v.string())),
		isActive: v.optional(v.boolean()),
		isFeatured: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const { styleId, ...updates } = args;

		await ctx.db.patch(styleId, {
			...updates,
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});

/**
 * Mutation: Update style images
 */
export const updateStyleImages = mutation({
	args: {
		styleId: v.id("styles"),
		images: v.array(v.object({
			url: v.string(),
			publicId: v.string(),
			width: v.number(),
			height: v.number(),
			alt: v.optional(v.string()),
		})),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.styleId, {
			images: args.images,
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});

/**
 * Mutation: Increment style views
 */
export const incrementStyleViews = mutation({
	args: { styleId: v.id("styles") },
	handler: async (ctx, args) => {
		const style = await ctx.db.get(args.styleId);
		if (!style) throw new Error("Style not found");

		await ctx.db.patch(args.styleId, {
			stats: {
				...style.stats,
				views: style.stats.views + 1,
			},
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});

/**
 * Mutation: Delete style
 */
export const deleteStyle = mutation({
	args: { styleId: v.id("styles") },
	handler: async (ctx, args) => {
		const style = await ctx.db.get(args.styleId);
		if (!style) throw new Error("Style not found");

		await ctx.db.delete(args.styleId);

		// Update organization stats
		const org = await ctx.db.get(style.organizationId);
		if (org) {
			await ctx.db.patch(style.organizationId, {
				stats: {
					...org.stats,
					totalDesigns: Math.max(0, org.stats.totalDesigns - 1),
				},
				updatedAt: Date.now(),
			});
		}

		return { success: true };
	},
});