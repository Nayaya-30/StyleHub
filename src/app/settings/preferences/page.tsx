"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PreferencesPage() {
  const { user } = useUser();
  const update = useMutation(api.users.updateUserPreferences);
  const [language, setLanguage] = useState(user?.preferences.language ?? "en");
  const [currency, setCurrency] = useState(user?.preferences.currency ?? "NGN");
  const [measurementUnit, setMeasurementUnit] = useState(user?.preferences.measurementUnit ?? "cm");
  const [emailNotif, setEmailNotif] = useState(user?.preferences.notifications.email ?? true);
  const [pushNotif, setPushNotif] = useState(user?.preferences.notifications.push ?? true);
  const [smsNotif, setSmsNotif] = useState(user?.preferences.notifications.sms ?? false);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Preferences</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
        <Card className="p-4 space-y-3">
          <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Currency" />
          <div className="flex items-center gap-3">
            <label className="text-sm">Measurement Unit</label>
            <select className="rounded border p-2 text-sm" value={measurementUnit} onChange={(e) => setMeasurementUnit(e.target.value)}>
              <option value="cm">CM</option>
              <option value="inches">Inches</option>
            </select>
          </div>
          <div className="flex items-center gap-6">
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} /> Email</label>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} /> Push</label>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} /> SMS</label>
          </div>
          <Button onClick={async () => {
            await update({
              userId: user._id,
              preferences: {
                notifications: { email: emailNotif, push: pushNotif, sms: smsNotif },
                language,
                currency,
                measurementUnit: measurementUnit as "cm" | "inches",
              },
            });
          }}>Save</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
