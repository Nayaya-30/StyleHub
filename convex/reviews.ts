import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, rateLimit, audit } from "./security";

export const getReviewsByOrganization = query({
  args: { organizationId: v.id("organizations"), status: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireSameOrg(args.organizationId as Id<"organizations">, user.organizationId);
    const base = ctx.db
      .query("reviews")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc");
    let reviews = await base.collect();
    if (args.status) reviews = reviews.filter((r) => r.status === args.status);
    return args.limit ? reviews.slice(0, args.limit) : reviews;
  },
});

export const getReviewsByStyle = query({
  args: { styleId: v.id("styles"), status: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const style = await ctx.db.get(args.styleId);
    if (!style) throw new Error("Style not found");
    requireSameOrg(style.organizationId as Id<"organizations">, user.organizationId);
    const base = ctx.db
      .query("reviews")
      .withIndex("by_style", (q) => q.eq("styleId", args.styleId))
      .order("desc");
    let reviews = await base.collect();
    if (args.status) reviews = reviews.filter((r) => r.status === args.status);
    return args.limit ? reviews.slice(0, args.limit) : reviews;
  },
});

export const createReview = mutation({
  args: {
    orderId: v.id("orders"),
    organizationId: v.id("organizations"),
    styleId: v.id("styles"),
    customerId: v.id("users"),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    images: v.optional(v.array(v.string())),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    if (user._id !== args.customerId) throw new Error("Forbidden");
    requireSameOrg(args.organizationId as Id<"organizations">, user.organizationId);
    await rateLimit(ctx, user._id, "createReview", 60_000, 5);
    const reviewId = await ctx.db.insert("reviews", {
      orderId: args.orderId,
      organizationId: args.organizationId,
      styleId: args.styleId,
      customerId: args.customerId,
      rating: args.rating,
      title: args.title,
      content: args.content,
      images: args.images,
      pros: args.pros,
      cons: args.cons,
      isVerified: true,
      response: undefined,
      helpfulCount: 0,
      reportCount: 0,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    await audit(ctx, {
      organizationId: args.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "review.create",
      targetType: "review",
      targetId: reviewId as unknown as string,
      metadata: { rating: args.rating },
    });
    return reviewId;
  },
});

export const updateReviewStatus = mutation({
  args: { reviewId: v.id("reviews"), status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("flagged")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    requireSameOrg(review.organizationId as Id<"organizations">, user.organizationId);
    // Admins/managers only
    const role = user.role;
    if (!(role === "org_admin" || role === "manager" || role === "super_admin")) {
      throw new Error("Forbidden");
    }
    await ctx.db.patch(args.reviewId, { status: args.status, updatedAt: Date.now() });
    await audit(ctx, {
      organizationId: review.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "review.status",
      targetType: "review",
      targetId: args.reviewId as unknown as string,
      metadata: { status: args.status },
    });
    return { success: true };
  },
});

export const respondToReview = mutation({
  args: { reviewId: v.id("reviews"), responderId: v.id("users"), content: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user._id !== args.responderId) throw new Error("Forbidden");
    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    requireSameOrg(review.organizationId as Id<"organizations">, user.organizationId);
    // Admins/managers only can respond
    const role = user.role;
    if (!(role === "org_admin" || role === "manager" || role === "super_admin")) {
      throw new Error("Forbidden");
    }
    await ctx.db.patch(args.reviewId, {
      response: { content: args.content, respondedBy: args.responderId, respondedAt: Date.now() },
      updatedAt: Date.now(),
    });
    await audit(ctx, {
      organizationId: review.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "review.respond",
      targetType: "review",
      targetId: args.reviewId as unknown as string,
      metadata: { contentLength: args.content.length },
    });
    return { success: true };
  },
});
