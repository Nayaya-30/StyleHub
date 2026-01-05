"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export default function CustomersPage() {
  const { user } = useUser();
  const customers = useQuery(
    api.users.getUsersByRole,
    user?.organizationId ? { role: "customer", organizationId: user.organizationId } : "skip"
  );
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Your organization customers</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers?.map((c) => (
          <Link key={c._id} href={`/dashboard/customers/${c._id}`}>
            <div className="rounded border p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.email}</div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

