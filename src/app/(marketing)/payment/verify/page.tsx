// ============================================
// FILE: src/app/payment/verify/page.tsx
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");

  const verifyPayment = useAction(api.actions.verifyPayment);

  useEffect(() => {
    const verify = async () => {
      if (!transactionId || !txRef) {
        setStatus("failed");
        setMessage("Invalid payment parameters");
        return;
      }

      try {
        const result = await verifyPayment({
          transactionId,
          txRef,
        });

        if (result.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          
          // Redirect to order page after 3 seconds
          setTimeout(() => {
            router.push("/dashboard/orders");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage("An error occurred while verifying your payment.");
      }
    };

    verify();
  }, [transactionId, txRef, verifyPayment, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {status === "verifying" && (
              <>
                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                  <p className="text-muted-foreground">{message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting to your orders...
                  </p>
                </div>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                  <XCircle className="h-10 w-10 text-error" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard/orders">
                    <Button className="w-full">View Orders</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Go Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}