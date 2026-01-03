// ============================================
// FILE: src/app/api/webhooks/flutterwave/route.ts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

    // Verify webhook signature
    const signature = req.headers.get("verif-hash");
    if (!signature || signature !== secretHash) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const { event, data } = body;

    if (event === "charge.completed") {
      const { tx_ref, status, amount, currency } = data;

      // Update payment status in Convex
      await convex.action(api.actions.verifyPayment, {
        transactionId: data.id.toString(),
        txRef: tx_ref,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Flutterwave webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}