// ============================================
// FILE: convex/payments.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, audit } from "./security";

/**
 * Query: Get payment by transaction reference
 */
export const getPaymentByTransactionRef = query({
  args: { transactionRef: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_transaction_ref", (q) =>
        q.eq("transactionRef", args.transactionRef)
      )
      .first();

    if (payment) {
      requireSameOrg(payment.organizationId as Id<"organizations">, user.organizationId);
    }
    return payment;
  },
});

/**
 * Query: Get payments by order
 */
export const getPaymentsByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    requireSameOrg(order.organizationId as Id<"organizations">, user.organizationId);
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .order("desc")
      .collect();

    return payments;
  },
});

/**
 * Mutation: Create payment record
 */
export const createPayment = mutation({
	args: {
		orderId: v.id("orders"),
		amount: v.number(),
		currency: v.string(),
		transactionRef: v.string(),
		providerRef: v.string(),
		paymentMethod: v.string(),
	},
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    requireSameOrg(order.organizationId as Id<"organizations">, user.organizationId);

    const now = Date.now();

    const paymentId = await ctx.db.insert("payments", {
      orderId: args.orderId,
      customerId: order.customerId,
      organizationId: order.organizationId,
      amount: args.amount,
      currency: args.currency,
      paymentMethod: args.paymentMethod,
      provider: "flutterwave",
      transactionRef: args.transactionRef,
      providerRef: args.providerRef,
      status: "pending",
      metadata: undefined,
      paidAt: undefined,
      failureReason: undefined,
      refundedAmount: undefined,
      refundedAt: undefined,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, {
      organizationId: order.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "payment.record.create",
      targetType: "payment",
      targetId: paymentId as unknown as string,
      metadata: { orderId: args.orderId, amount: args.amount, currency: args.currency },
    });
    return paymentId;
  },
});

/**
 * Mutation: Update payment status
 */
export const updatePaymentStatus = mutation({
  args: {
    transactionRef: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("successful"),
      v.literal("failed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    providerRef: v.optional(v.string()),
    metadata: v.optional(v.object({
      amount: v.optional(v.number()),
      currency: v.optional(v.string()),
      paymentType: v.optional(v.string()),
    })),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_transaction_ref", (q) =>
        q.eq("transactionRef", args.transactionRef)
      )
      .first();

    if (!payment) throw new Error("Payment not found");
    requireSameOrg(payment.organizationId as Id<"organizations">, user.organizationId);

    const now = Date.now();
    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    };

		if (args.providerRef) {
			updates.providerRef = args.providerRef;
		}

		if (args.metadata) {
			updates.metadata = args.metadata;
		}

		if (args.failureReason) {
			updates.failureReason = args.failureReason;
		}

    if (args.status === "successful") {
      const order = await ctx.db.get(payment.orderId);
      if (order) {
        const metaAmount = args.metadata?.amount;
        const metaCurrency = args.metadata?.currency;
        const matchesAmount = typeof metaAmount === "number" && metaAmount === order.pricing.total;
        const matchesCurrency = typeof metaCurrency === "string" && metaCurrency === order.pricing.currency;

        if (matchesAmount && matchesCurrency) {
          updates.paidAt = now;
          await ctx.db.patch(payment.orderId, {
            paymentStatus: "paid",
            timeline: [
              ...order.timeline,
              {
                event: "payment_received",
                description: "Payment received successfully",
                timestamp: now,
                actor: undefined,
              },
            ],
            updatedAt: now,
          });
        } else {
          updates.status = "failed";
          updates.failureReason = "amount_or_currency_mismatch";
        }
      }
    }

    await ctx.db.patch(payment._id, updates);

    await audit(ctx, {
      organizationId: payment.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "payment.status.update",
      targetType: "payment",
      targetId: payment._id as unknown as string,
      metadata: { status: args.status },
    });

    return { success: true };
  },
});
