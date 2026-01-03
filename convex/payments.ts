// ============================================
// FILE: convex/payments.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get payment by transaction reference
 */
export const getPaymentByTransactionRef = query({
	args: { transactionRef: v.string() },
	handler: async (ctx, args) => {
		const payment = await ctx.db
			.query("payments")
			.withIndex("by_transaction_ref", (q) =>
				q.eq("transactionRef", args.transactionRef)
			)
			.first();

		return payment;
	},
});

/**
 * Query: Get payments by order
 */
export const getPaymentsByOrder = query({
	args: { orderId: v.id("orders") },
	handler: async (ctx, args) => {
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
		const order = await ctx.db.get(args.orderId);
		if (!order) throw new Error("Order not found");

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
		metadata: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
		failureReason: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const payment = await ctx.db
			.query("payments")
			.withIndex("by_transaction_ref", (q) =>
				q.eq("transactionRef", args.transactionRef)
			)
			.first();

		if (!payment) throw new Error("Payment not found");

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
			updates.paidAt = now;

			// Update order payment status
			const order = await ctx.db.get(payment.orderId);
			if (order) {
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
			}
		}

		await ctx.db.patch(payment._id, updates);

		return { success: true };
	},
});
