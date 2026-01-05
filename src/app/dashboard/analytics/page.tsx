"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/features/StatsCard";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AnalyticsPage() {
  const { user } = useUser();
  const org = useQuery(api.organisations.getOrganizationById, user?.organizationId ? { organizationId: user.organizationId } : "skip");
  const isLoading = org === undefined;
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Organization performance metrics</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? null : (
            <>
              <StatsCard title="Total Designs" value={org?.stats.totalDesigns ?? 0} />
              <StatsCard title="Completed Orders" value={org?.stats.completedOrders ?? 0} />
              <StatsCard title="Average Rating" value={(org?.stats.averageRating ?? 0).toFixed(1)} />
              <StatsCard title="Total Reviews" value={org?.stats.totalReviews ?? 0} />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

