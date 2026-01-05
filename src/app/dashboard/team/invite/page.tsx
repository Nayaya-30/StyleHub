"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InviteForm } from "@/components/forms/InviteForm";
import { useUser } from "@/hooks/useUser";

export default function InviteMemberPage() {
  const { user } = useUser();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invite Team Member</h1>
          <p className="text-muted-foreground">Send an invitation to join your organization</p>
        </div>
        {user?.organizationId && (
          <InviteForm organizationId={user.organizationId} invitedBy={user._id} />
        )}
      </div>
    </DashboardLayout>
  );
}

