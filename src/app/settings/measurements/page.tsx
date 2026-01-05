"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { MeasurementForm } from "@/components/forms/MeasurementForm";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MeasurementsSettingsPage() {
  const { user } = useUser();
  const save = useMutation(api.users.saveUserMeasurements);
  if (!user) return null;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Measurements</h1>
          <p className="text-muted-foreground">Save your body measurements</p>
        </div>
        <MeasurementForm
          initial={user.savedMeasurements}
          onSubmit={async (m) => {
            await save({ userId: user._id, measurements: m });
          }}
        />
      </div>
    </DashboardLayout>
  );
}

