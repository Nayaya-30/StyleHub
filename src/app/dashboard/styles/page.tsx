"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StyleCard } from "@/components/features/StyleCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function StylesManagementPage() {
  const { user } = useUser();
  const styles = useQuery(
    api.styles.getStylesByOrganization,
    user?.organizationId ? { organizationId: user.organizationId } : "skip"
  );
  const isLoading = styles === undefined;
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Styles</h1>
          <p className="text-muted-foreground">Create, edit and organize your catalog</p>
        </div>
        <Link href="/dashboard/styles/create">
          <Button>Create Style</Button>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? null : styles?.map((s) => <StyleCard key={s._id} style={s} />)}
      </div>
    </DashboardLayout>
  );
}
