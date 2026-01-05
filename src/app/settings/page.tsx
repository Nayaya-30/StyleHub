"use client";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SettingsIndexPage() {
  const items = [
    { href: "/settings/profile", title: "Profile", desc: "Update your personal information" },
    { href: "/settings/preferences", title: "Preferences", desc: "Language, currency, notifications" },
    { href: "/settings/measurements", title: "Measurements", desc: "Save your body measurements" },
    { href: "/settings/security", title: "Security", desc: "Manage security settings" },
  ];
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="rounded border p-4">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-muted-foreground">{i.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

