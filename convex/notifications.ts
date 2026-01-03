// ============================================
// FILE: convex/notifications.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get notifications for user
 */
export const getUserNotifications = query({
  args: {
    userId: v.id("users"),
    isRead: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    let notifications = await query.collect();

    if (args.isRead !== undefined) {
      notifications = notifications.filter(n => n.isRead === args.isRead);
    }

    // Filter out expired notifications
    const now = Date.now();
    notifications = notifications.filter(
      n => !n.expiresAt || n.expiresAt > now
    );

    if (args.limit) {
      return notifications.slice(0, args.limit);
    }

    return notifications;
  },
});

/**
 * Query: Get unread notification count
 */
export const getUnreadNotificationCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    const now = Date.now();
    const activeNotifications = notifications.filter(
      n => !n.expiresAt || n.expiresAt > now
    );

    return activeNotifications.length;
  },
});

/**
 * Mutation: Create notification
 */
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
    orderId: v.optional(v.id("orders")),
    styleId: v.optional(v.id("styles")),
    senderId: v.optional(v.id("users")),
    actionUrl: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high")
    )),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data,
      orderId: args.orderId,
      styleId: args.styleId,
      senderId: args.senderId,
      isRead: false,
      readAt: undefined,
      actionUrl: args.actionUrl,
      priority: args.priority || "normal",
      expiresAt: args.expiresAt,
      createdAt: now,
    });

    return notificationId;
  },
});

/**
 * Mutation: Mark notification as read
 */
export const markNotificationAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
      readAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Mark all notifications as read
 */
export const markAllNotificationsAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    const now = Date.now();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
        readAt: now,
      });
    }

    return { success: true };
  },
});

/**
 * Mutation: Delete notification
 */
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});

/**
 * Mutation: Delete all read notifications
 */
export const deleteReadNotifications = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), true))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    return { success: true };
  },
});