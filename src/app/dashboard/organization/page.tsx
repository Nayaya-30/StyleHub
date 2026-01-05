"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrganizationForm } from "@/components/forms/OrganizationForm";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function OrganizationSettingsPage() {
  const { user } = useUser();
  const org = useQuery(api.organisations.getOrganizationById, user?.organizationId ? { organizationId: user.organizationId } : "skip");
  if (org === undefined) return null;
  if (!org) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">No organization found</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">Update your organization profile and preferences</p>
        </div>
        <OrganizationForm organizationId={org._id} initial={{ name: org.name, slug: org.slug, description: org.description }} />
      </div>
    </DashboardLayout>
  );
}

