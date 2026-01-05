"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { Id } from "@/convex/_generated/dataModel";
import { WorkerTaskCard } from "@/components/features/WorkerTaskCard";

export default function WorkerDetailPage() {
  const params = useParams<{ workerId: string }>();
  const workerId = params.workerId as unknown as Id<"users">;
  const assignments = useQuery(api.assignments.getAssignmentsByWorker, { workerId });
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Worker Tasks</h1>
          <p className="text-muted-foreground">Assigned tasks and progress</p>
        </div>
        <div className="space-y-3">
          {assignments?.map((a) => (
            <WorkerTaskCard key={a._id} assignment={a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

