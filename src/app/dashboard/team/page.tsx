"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const { user } = useUser();
  const invites = useQuery(
    api.invitations.getInvitationsByOrganization,
    user?.organizationId ? { organizationId: user.organizationId } : "skip"
  );
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">Manage members and invites</p>
        </div>
        <Link href="/dashboard/team/invite">
          <Button>Invite Member</Button>
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {invites?.map((i) => (
          <div key={i._id} className="rounded border p-3">
            <div className="font-medium">{i.email}</div>
            <div className="text-xs text-muted-foreground">Role: {i.role} • Status: {i.status}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

