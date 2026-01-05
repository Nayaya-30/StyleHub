"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { useSavedStyles } from "@/hooks/useSavedStyles";
import Link from "next/link";

export default function SavedStylesPage() {
  const { user } = useUser();
  const { savedStyles } = useSavedStyles(user?._id);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Saved Styles</h1>
          <p className="text-muted-foreground">Your favorites for quick access</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedStyles.map((s) => (
            <Link key={s._id} href={`/styles/${s.styleId}`} className="rounded border p-3">
              <div className="font-medium">View Style</div>
              <div className="text-xs text-muted-foreground">Style ID: {s.styleId}</div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

