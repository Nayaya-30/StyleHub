// ============================================
// FILE: convex/orders.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get order by ID
 */
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    return order;
  },
});

/**
 * Query: Get order by order number
 */
export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => 
        q.eq("orderNumber", args.orderNumber)
      )
      .first();

    return order;
  },
});

/**
 * Query: Get orders by customer
 */
export const getOrdersByCustomer = query({
  args: {
    customerId: v.id("users"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc");

    let orders = await query.collect();

    if (args.status) {
      orders = orders.filter(o => o.status === args.status);
    }

    if (args.limit) {
      return orders.slice(0, args.limit);
    }

    return orders;
  },
});

/**
 * Query: Get orders by organization
 */
export const getOrdersByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("orders")
      .withIndex("by_organization", (q) => 
        q.eq("organizationId", args.organizationId)
      )
      .order("desc");

    let orders = await query.collect();

    if (args.status) {
      orders = orders.filter(o => o.status === args.status);
    }

    if (args.paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === args.paymentStatus);
    }

    if (args.limit) {
      return orders.slice(0, args.limit);
    }

    return orders;
  },
});

/**
 * Query: Get orders by assigned worker
 */
export const getOrdersByWorker = query({
  args: {
    workerId: v.id("users"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_assigned_workers", (q) => 
        q.eq("assignedWorkers", [args.workerId])
      )
      .collect();

    if (args.status) {
      return orders.filter(o => o.status === args.status);
    }

    return orders;
  },
});

/**
 * Mutation: Create order
 */
export const createOrder = mutation({
  args: {
    customerId: v.id("users"),
    organizationId: v.id("organizations"),
    styleId: v.id("styles"),
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
    additionalNotes: v.optional(v.string()),
    customizationRequests: v.optional(v.string()),
    pricing: v.object({
      basePrice: v.number(),
      customizationFee: v.number(),
      deliveryFee: v.number(),
      discount: v.number(),
      tax: v.number(),
      total: v.number(),
      currency: v.string(),
    }),
    deliveryAddress: v.string(),
    deliveryPhone: v.string(),
    deliveryInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate unique order number
    const timestamp = now.toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${randomStr}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      customerId: args.customerId,
      organizationId: args.organizationId,
      styleId: args.styleId,
      measurements: args.measurements,
      additionalNotes: args.additionalNotes,
      customizationRequests: args.customizationRequests,
      selectedOptions: undefined,
      pricing: args.pricing,
      negotiatedPrice: undefined,
      status: "pending",
      paymentStatus: "unpaid",
      currentStage: undefined,
      progress: {
        cutting: { status: "pending" },
        sewing: { status: "pending" },
        finishing: { status: "pending" },
      },
      assignedWorkers: undefined,
      assignedBy: undefined,
      assignedAt: undefined,
      delivery: {
        address: args.deliveryAddress,
        phone: args.deliveryPhone,
        instructions: args.deliveryInstructions,
        status: "pending",
      },
      timeline: [
        {
          event: "order_created",
          description: "Order placed successfully",
          timestamp: now,
          actor: args.customerId,
        },
      ],
      rating: undefined,
      createdAt: now,
      updatedAt: now,
    });

    // Check if customer-organization relationship exists
    const customerOrg = await ctx.db
      .query("customerOrganizations")
      .withIndex("by_customer_and_org", (q) => 
        q.eq("customerId", args.customerId).eq("organizationId", args.organizationId)
      )
      .first();

    if (!customerOrg) {
      // Create customer-organization relationship
      await ctx.db.insert("customerOrganizations", {
        customerId: args.customerId,
        organizationId: args.organizationId,
        firstOrderId: orderId,
        stats: {
          totalOrders: 1,
          completedOrders: 0,
          totalSpent: args.pricing.total,
          averageOrderValue: args.pricing.total,
          lastOrderDate: now,
        },
        preferences: undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing relationship
      await ctx.db.patch(customerOrg._id, {
        stats: {
          totalOrders: customerOrg.stats.totalOrders + 1,
          completedOrders: customerOrg.stats.completedOrders,
          totalSpent: customerOrg.stats.totalSpent + args.pricing.total,
          averageOrderValue: 
            (customerOrg.stats.totalSpent + args.pricing.total) / 
            (customerOrg.stats.totalOrders + 1),
          lastOrderDate: now,
        },
        updatedAt: now,
      });
    }

    return orderId;
  },
});

/**
 * Mutation: Update order status
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    actorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const now = Date.now();

    await ctx.db.patch(args.orderId, {
      status: args.status,
      timeline: [
        ...order.timeline,
        {
          event: `order_${args.status}`,
          description: `Order status updated to ${args.status}`,
          timestamp: now,
          actor: args.actorId,
        },
      ],
      updatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Mutation: Update order progress
 */
export const updateOrderProgress = mutation({
  args: {
    orderId: v.id("orders"),
    stage: v.union(v.literal("cutting"), v.literal("sewing"), v.literal("finishing")),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
    notes: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    actorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const now = Date.now();
    const updatedProgress = { ...order.progress };
    
    updatedProgress[args.stage] = {
      status: args.status,
      startedAt: args.status === "in_progress" && !updatedProgress[args.stage].startedAt 
        ? now 
        : updatedProgress[args.stage].startedAt,
      completedAt: args.status === "completed" ? now : undefined,
      notes: args.notes,
      images: args.images,
    };

    await ctx.db.patch(args.orderId, {
      progress: updatedProgress,
      currentStage: args.status === "completed" ? undefined : args.stage,
      timeline: [
        ...order.timeline,
        {
          event: `progress_${args.stage}_${args.status}`,
          description: `${args.stage} stage ${args.status}`,
          timestamp: now,
          actor: args.actorId,
        },
      ],
      updatedAt: now,
    });

    return { success: true };
  },
});