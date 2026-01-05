"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderCard } from "@/components/features/OrderCard";

export default function CustomerDetailPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId as unknown as Id<"users">;
  const user = useQuery(api.users.getUserById, { userId: customerId });
  const orders = useQuery(api.orders.getOrdersByCustomer, { customerId });
  if (user === undefined || orders === undefined) return null;
  if (!user) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Customer not found</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="space-y-3">
          {orders?.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

