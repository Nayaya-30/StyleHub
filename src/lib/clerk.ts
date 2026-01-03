// ============================================
// FILE: src/lib/clerk.ts
// ============================================

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function validateClerkWebhook(
  body: string
): Promise<WebhookEvent | null> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return null;
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;

    return evt;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return null;
  }
}

// ============================================
// FILE: src/app/api/webhooks/clerk/route.ts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { validateClerkWebhook } from "@/lib/clerk";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const evt = await validateClerkWebhook(body);

  if (!evt) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses[0]?.email_address || "";
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

      await convex.mutation(api.users.upsertUser, {
        clerkId: id,
        email,
        name,
        avatar: image_url,
      });
    }

    if (eventType === "organization.created" || eventType === "organization.updated") {
      const { id, name, slug, image_url } = evt.data;

      await convex.mutation(api.organizations.createOrganization, {
        clerkOrgId: id,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: "",
        address: "",
        phone: "",
        email: "",
        logo: image_url,
      });
    }

    if (eventType === "organizationMembership.created") {
      const { organization, public_user_data } = evt.data;
      const userId = public_user_data.user_id;

      // Get the organization from Convex
      const org = await convex.query(api.organizations.getOrganizationByClerkId, {
        clerkOrgId: organization.id,
      });

      if (org && userId) {
        // Get the user
        const user = await convex.query(api.users.getUserByClerkId, {
          clerkId: userId,
        });

        if (user) {
          // Update user's organization
          await convex.mutation(api.users.updateUserProfile, {
            userId: user._id,
            organizationId: org._id,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}