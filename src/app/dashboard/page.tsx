// ============================================
// FILE: src/app/dashboard/page.tsx
// ============================================

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import { OrderCard } from "@/components/features/OrderCard";
import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();

  const orders = useQuery(
    api.orders.getOrdersByCustomer,
    user?._id ? { customerId: user._id, limit: 5 } : "skip"
  );

  const isLoading = user === undefined || orders === undefined;

  if (isLoading) {
    return (
      <DashboardLayout>
        <SkeletonWrapper>
          <DashboardSkeleton />
        </SkeletonWrapper>
      </DashboardLayout>
    );
  }

  const stats = user?.stats || {
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    savedStyles: 0,
  };

  const activeOrders = orders?.filter((o) => 
    o.status === "in_progress" || o.status === "confirmed" || o.status === "pending"
  ).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your orders
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved Styles
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.savedStyles}</div>
              <Link href="/saved">
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  View collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/dashboard/orders">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start by browsing our amazing collection of styles
                </p>
                <Link href="/styles">
                  <Button>Browse Styles</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/styles">
              <Card className="hover-scale cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Package className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Browse Styles</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Discover new designs
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/saved">
              <Card className="hover-scale cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Saved Styles</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    View your collection
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/messages">
              <Card className="hover-scale cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Messages</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Chat with tailors
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}