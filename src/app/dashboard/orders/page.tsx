// ============================================
// FILE: src/app/dashboard/orders/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderCard } from "@/components/features/OrderCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderListSkeleton } from "@/components/loading/OrderCardSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderStatus } from "@/types";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");

  const orders = useQuery(
    api.orders.getOrdersByCustomer,
    user?._id
      ? {
          customerId: user._id,
          status: activeTab === "all" ? undefined : activeTab,
        }
      : "skip"
  );

  const isLoading = orders === undefined;

  const tabs = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "delivered", label: "Delivered" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>
          <Link href="/styles">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <SkeletonWrapper>
                <OrderListSkeleton count={5} />
              </SkeletonWrapper>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No orders found"
                description={
                  activeTab === "all"
                    ? "You haven't placed any orders yet"
                    : `No ${activeTab} orders`
                }
                action={{
                  label: "Browse Styles",
                  onClick: () => (window.location.href = "/styles"),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}