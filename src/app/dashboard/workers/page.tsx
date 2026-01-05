"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkersPage() {
  const { user } = useUser();
  const workers = useQuery(
    api.users.getUsersByRole,
    user?.organizationId ? { role: "worker", organizationId: user.organizationId } : "skip"
  );
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workers</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workers?.map((w) => (
          <Link key={w._id} href={`/dashboard/workers/${w._id}`}>
            <div className="rounded border p-3">
              <div className="font-medium">{w.name}</div>
              <div className="text-xs text-muted-foreground">{w.email}</div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

