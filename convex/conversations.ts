// ============================================
// FILE: convex/conversations.ts
// ============================================

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Query: Get conversations for user
 */
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.or(
          q.eq(q.field("participants")[0], args.userId),
          q.eq(q.field("participants")[1], args.userId)
        )
      )
      .order("desc")
      .collect();

    return conversations;
  },
});

/**
 * Query: Get conversation by participants
 */
export const getConversationByParticipants = query({
  args: {
    participant1: v.id("users"),
    participant2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.or(
          q.and(
            q.eq(q.field("participants")[0], args.participant1),
            q.eq(q.field("participants")[1], args.participant2)
          ),
          q.and(
            q.eq(q.field("participants")[0], args.participant2),
            q.eq(q.field("participants")[1], args.participant1)
          )
        )
      )
      .first();

    return conversation;
  },
});

/**
 * Mutation: Archive conversation
 */
export const archiveConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    isArchived: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      isArchived: args.isArchived,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});