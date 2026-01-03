// ============================================
// FILE: convex/messages.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get messages by conversation
 */
export const getMessagesByConversation = query({
  args: {
    conversationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

/**
 * Query: Get messages by order
 */
export const getMessagesByOrder = query({
  args: {
    orderId: v.id("orders"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("messages")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

/**
 * Query: Get unread message count for user
 */
export const getUnreadMessageCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return messages.length;
  },
});

/**
 * Mutation: Send message
 */
export const sendMessage = mutation({
  args: {
    conversationId: v.string(),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("system")
    ),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    replyTo: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      receiverId: args.receiverId,
      orderId: args.orderId,
      content: args.content,
      type: args.type,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileSize: args.fileSize,
      metadata: undefined,
      isRead: false,
      isEdited: false,
      editedAt: undefined,
      deletedAt: undefined,
      replyTo: args.replyTo,
      reactions: undefined,
      createdAt: now,
    });

    // Update or create conversation
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.eq(q.field("participants"), [args.senderId, args.receiverId])
      )
      .first();

    if (conversation) {
      const currentUnreadCounts = conversation.unreadCounts;
      currentUnreadCounts[args.receiverId] = (currentUnreadCounts[args.receiverId] || 0) + 1;

      await ctx.db.patch(conversation._id, {
        lastMessage: {
          content: args.content,
          senderId: args.senderId,
          timestamp: now,
        },
        unreadCounts: currentUnreadCounts,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("conversations", {
        participants: [args.senderId, args.receiverId],
        orderId: args.orderId,
        type: args.orderId ? "order" : "direct",
        lastMessage: {
          content: args.content,
          senderId: args.senderId,
          timestamp: now,
        },
        unreadCounts: {
          [args.receiverId]: 1,
          [args.senderId]: 0,
        },
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return messageId;
  },
});

/**
 * Mutation: Mark messages as read
 */
export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("receiverId"), args.userId),
          q.eq(q.field("isRead"), false)
        )
      )
      .collect();

    const now = Date.now();
    
    for (const message of messages) {
      await ctx.db.patch(message._id, {
        isRead: true,
        updatedAt: now,
      });
    }

    // Update conversation unread count
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.eq(q.field("participants"), args.conversationId.split("-").slice(1))
      )
      .first();

    if (conversation) {
      const currentUnreadCounts = conversation.unreadCounts;
      currentUnreadCounts[args.userId] = 0;

      await ctx.db.patch(conversation._id, {
        unreadCounts: currentUnreadCounts,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

/**
 * Mutation: Edit message
 */
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.messageId, {
      content: args.content,
      isEdited: true,
      editedAt: now,
    });

    return { success: true };
  },
});

/**
 * Mutation: Delete message
 */
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      deletedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mutation: Add reaction to message
 */
export const addMessageReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const reactions = message.reactions || [];
    const existingReaction = reactions.find(
      (r) => r.userId === args.userId && r.emoji === args.emoji
    );

    if (existingReaction) {
      // Remove reaction
      await ctx.db.patch(args.messageId, {
        reactions: reactions.filter(
          (r) => !(r.userId === args.userId && r.emoji === args.emoji)
        ),
      });
    } else {
      // Add reaction
      await ctx.db.patch(args.messageId, {
        reactions: [
          ...reactions,
          {
            userId: args.userId,
            emoji: args.emoji,
            timestamp: Date.now(),
          },
        ],
      });
    }

    return { success: true };
  },
});
