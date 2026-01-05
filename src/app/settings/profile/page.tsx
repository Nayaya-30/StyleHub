"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { useUser } from "@/hooks/useUser";

export default function ProfileSettingsPage() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Update your personal information</p>
        </div>
        <ProfileForm userId={user._id} initial={{ name: user.name, phone: user.phone }} />
      </div>
    </DashboardLayout>
  );
}

