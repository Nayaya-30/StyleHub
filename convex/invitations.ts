import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { getCurrentUser, requireSameOrg, requireRole, rateLimit, audit } from "./security";

export const getInvitationsByOrganization = query({
  args: { organizationId: v.id("organizations"), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    requireSameOrg(args.organizationId as Id<"organizations">, user.organizationId);
    const base = ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc");
    const invites = await base.collect();
    if (args.status) return invites.filter((i) => i.status === args.status);
    return invites;
  },
});

export const createInvitation = mutation({
  args: {
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("org_admin"), v.literal("manager"), v.literal("worker")),
    invitedBy: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = await getCurrentUser(ctx);
    if (user._id !== args.invitedBy) throw new Error("Forbidden");
    requireSameOrg(args.organizationId as Id<"organizations">, user.organizationId);
    requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    await rateLimit(ctx, user._id, "createInvitation", 60_000, 10);
    const token = Math.random().toString(36).slice(2, 12).toUpperCase();
    const invitationId = await ctx.db.insert("invitations", {
      organizationId: args.organizationId,
      email: args.email,
      role: args.role,
      invitedBy: args.invitedBy,
      token,
      status: "pending",
      message: args.message,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
      acceptedAt: undefined,
      createdAt: now,
    });
    await ctx.runAction(api.actions.sendInvitationEmail, {
      email: args.email,
      organizationName: (await ctx.db.get(args.organizationId))?.name || "",
      inviterName: (await ctx.db.get(args.invitedBy))?.name || "",
      role: args.role,
      invitationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/team/invite?token=${token}`,
    });
    await audit(ctx, {
      organizationId: args.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "invitation.create",
      targetType: "invitation",
      targetId: invitationId as unknown as string,
      metadata: { email: args.email, role: args.role },
    });
    return invitationId;
  },
});

export const acceptInvitation = mutation({
  args: { token: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!invite || invite.status !== "pending") throw new Error("Invalid invitation");
    const user = await getCurrentUser(ctx);
    if (user._id !== args.userId) throw new Error("Forbidden");
    await rateLimit(ctx, user._id, "acceptInvitation", 60_000, 5);
    const now = Date.now();
    await ctx.db.patch(invite._id, { status: "accepted", acceptedAt: now });
    await ctx.db.patch(args.userId, { organizationId: invite.organizationId, updatedAt: now });
    await audit(ctx, {
      organizationId: invite.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "invitation.accept",
      targetType: "invitation",
      targetId: invite._id as unknown as string,
      metadata: {},
    });
    return { success: true };
  },
});

export const cancelInvitation = mutation({
  args: { invitationId: v.id("invitations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invite = await ctx.db.get(args.invitationId);
    if (!invite) throw new Error("Invitation not found");
    requireSameOrg(invite.organizationId as Id<"organizations">, user.organizationId);
    requireRole(user.role, ["org_admin", "manager", "super_admin"]);
    await ctx.db.patch(args.invitationId, { status: "cancelled" });
    await audit(ctx, {
      organizationId: invite.organizationId as Id<"organizations">,
      actorId: user._id,
      action: "invitation.cancel",
      targetType: "invitation",
      targetId: args.invitationId as unknown as string,
      metadata: {},
    });
    return { success: true };
  },
});
