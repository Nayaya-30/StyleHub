"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SecuritySettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground">Review your security settings</p>
        </div>
        <div className="rounded border p-4">
          <div className="font-medium">Sessions</div>
          <div className="text-sm text-muted-foreground">Manage your active sessions from your Clerk account settings.</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

