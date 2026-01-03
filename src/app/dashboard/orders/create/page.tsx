// ============================================
// FILE: src/app/dashboard/orders/create/page.tsx
// ============================================

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderForm } from "@/components/forms/OrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";

export default function CreateOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const styleId = searchParams.get("styleId");
  const { user } = useUser();

  const style = useQuery(
    api.styles.getStyleById,
    styleId ? { styleId: styleId as Id<"styles"> } : "skip"
  );

  const createOrder = useMutation(api.orders.createOrder);

  const handleSubmit = async (data: typeof orderFormData) => {
    if (!user || !style) return;

    try {
      const orderId = await createOrder({
        customerId: user._id,
        organizationId: style.organizationId,
        styleId: style._id,
        measurements: data.measurements,
        additionalNotes: data.additionalNotes,
        customizationRequests: data.customizationRequests,
        pricing: {
          basePrice: style.basePrice,
          customizationFee: 0, // Calculate based on options
          deliveryFee: 2000, // Default delivery fee
          discount: 0,
          tax: 0,
          total: style.basePrice + 2000,
          currency: style.currency,
        },
        deliveryAddress: data.deliveryAddress,
        deliveryPhone: data.deliveryPhone,
        deliveryInstructions: data.deliveryInstructions,
      });

      toast.success("Order placed successfully!");
      router.push(`/dashboard/orders/${orderId}`);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!styleId) {
    return (
      <DashboardLayout>
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No style selected. Please select a style from the showcase.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!style) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Place Your Order</h1>
          <p className="text-muted-foreground">
            Fill in the details below to place your order
          </p>
        </div>

        {/* Style Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {style.images[0] && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={style.images[0].url}
                    alt={style.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{style.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{style.description}</p>
                <div className="text-2xl font-bold">
                  {formatCurrency(style.basePrice, style.currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <OrderForm
          styleId={style._id}
          requiredMeasurements={style.measurements.required}
          basePrice={style.basePrice}
          currency={style.currency}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}