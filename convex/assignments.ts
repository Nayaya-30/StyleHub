// ============================================
// FILE: convex/assignments.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, requireRole, rateLimit, audit } from "./security";

/**
 * Query: Get assignments by worker
 */
export const getAssignmentsByWorker = query({
  args: {
    workerId: v.id("users"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const worker = await ctx.db.get(args.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const query = ctx.db
      .query("assignments")
      .withIndex("by_worker", (q) => q.eq("workerId", args.workerId))
      .order("desc");

    const assignments = await query.collect();

    if (args.status) {
      return assignments.filter(a => a.status === args.status);
    }

    return assignments;
  },
});

/**
 * Query: Get assignments by order
 */
export const getAssignmentsByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    requireSameOrg(order.organizationId as Id<"organizations">, user.organizationId);
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    return assignments;
  },
});

/**
 * Query: Get assignments by manager
 */
export const getAssignmentsByManager = query({
  args: { managerId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const manager = await ctx.db.get(args.managerId);
    if (!manager) throw new Error("Manager not found");
    requireSameOrg((manager.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_assigned_by", (q) => q.eq("assignedBy", args.managerId))
      .order("desc")
      .collect();

    return assignments;
  },
});

/**
 * Mutation: Create assignment
 */
export const createAssignment = mutation({
  args: {
    orderId: v.id("orders"),
    workerId: v.id("users"),
    stage: v.union(v.literal("cutting"), v.literal("sewing"), v.literal("finishing")),
    assignedBy: v.id("users"),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    notes: v.optional(v.string()),
    estimatedDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    if (user._id !== args.assignedBy) throw new Error("Forbidden");
    requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    const orderCheck = await ctx.db.get(args.orderId);
    if (!orderCheck) throw new Error("Order not found");
    requireSameOrg(orderCheck.organizationId as Id<"organizations">, user.organizationId);
    await rateLimit(ctx, user._id, "assignment.create", 60000, 20);

    const assignmentId = await ctx.db.insert("assignments", {
      orderId: args.orderId,
      workerId: args.workerId,
      stage: args.stage,
      assignedBy: args.assignedBy,
      status: "pending",
      priority: args.priority,
      notes: args.notes,
      estimatedDuration: args.estimatedDuration,
      actualDuration: undefined,
      progressUpdates: [],
      assignedAt: now,
      acceptedAt: undefined,
      startedAt: undefined,
      completedAt: undefined,
      updatedAt: now,
    });

    // Update order with assigned worker
    const order = await ctx.db.get(args.orderId);
    if (order) {
      const assignedWorkers = order.assignedWorkers || [];
      if (!assignedWorkers.includes(args.workerId)) {
        await ctx.db.patch(args.orderId, {
          assignedWorkers: [...assignedWorkers, args.workerId],
          assignedBy: args.assignedBy,
          assignedAt: now,
          timeline: [
            ...order.timeline,
            {
              event: "worker_assigned",
              description: `Worker assigned for ${args.stage} stage`,
              timestamp: now,
              actor: args.assignedBy,
            },
          ],
          updatedAt: now,
        });
      }
    }

    await audit(ctx, {
      organizationId: order!.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "assignment.create",
      targetType: "assignment",
      targetId: assignmentId as unknown as string,
      metadata: { stage: args.stage, workerId: args.workerId },
    });
    return assignmentId;
  },
});

/**
 * Mutation: Update assignment status
 */
export const updateAssignmentStatus = mutation({
  args: {
    assignmentId: v.id("assignments"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    const worker = await ctx.db.get(assignment.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const isWorker = user._id === assignment.workerId;
    const role = user.role;
    if (!isWorker && !(role === "org_admin" || role === "manager" || role === "super_admin")) {
      throw new Error("Forbidden");
    }

    const now = Date.now();
    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    };

    if (args.status === "accepted" && !assignment.acceptedAt) {
      updates.acceptedAt = now;
    }

    if (args.status === "in_progress" && !assignment.startedAt) {
      updates.startedAt = now;
    }

    if (args.status === "completed" && !assignment.completedAt) {
      updates.completedAt = now;
      if (assignment.startedAt) {
        updates.actualDuration = now - assignment.startedAt;
      }
    }

    await ctx.db.patch(args.assignmentId, updates);

    await audit(ctx, {
      organizationId: (worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: user._id,
      action: "assignment.status",
      targetType: "assignment",
      targetId: args.assignmentId as unknown as string,
      metadata: { status: args.status },
    });

    return { success: true };
  },
});

/**
 * Mutation: Add progress update
 */
export const addProgressUpdate = mutation({
  args: {
    assignmentId: v.id("assignments"),
    message: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    const worker = await ctx.db.get(assignment.workerId);
    if (!worker) throw new Error("Worker not found");
    requireSameOrg((worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">), user.organizationId);
    const isWorker = user._id === assignment.workerId;
    const role = user.role;
    if (!isWorker && !(role === "org_admin" || role === "manager" || role === "super_admin")) {
      throw new Error("Forbidden");
    }
    await rateLimit(ctx, user._id, "assignment.progress", 60000, 30);

    const now = Date.now();

    await ctx.db.patch(args.assignmentId, {
      progressUpdates: [
        ...assignment.progressUpdates,
        {
          message: args.message,
          images: args.images,
          timestamp: now,
        },
      ],
      updatedAt: now,
    });

    await audit(ctx, {
      organizationId: (worker.organizationId as Id<"organizations">) ?? ("" as Id<"organizations">),
      actorId: user._id,
      action: "assignment.progress",
      targetType: "assignment",
      targetId: args.assignmentId as unknown as string,
      metadata: { hasImages: Array.isArray(args.images) && args.images.length > 0 },
    });

    return { success: true };
  },
});
export const getAssignmentById = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    const assignment = await ctx.db.get(args.assignmentId);
    return assignment;
  },
});
