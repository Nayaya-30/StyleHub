// ============================================
// FILE: src/app/payment/success/page.tsx
// ============================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useMediaQuery";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard/orders");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={200}
      />
      
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-muted-foreground">
                Thank you for your order. We&apos;ve received your payment and your order
                is being processed.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3 text-left">
                <Package className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">What&apos;s Next?</div>
                  <p className="text-sm text-muted-foreground">
                    Our team will review your order and start production. You&apos;ll receive
                    updates via email and in your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard/orders">
                <Button size="lg" className="w-full">
                  View Your Orders
                </Button>
              </Link>
              <Link href="/styles">
                <Button size="lg" variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              Redirecting to your orders in 10 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
