"use client";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { Id } from "@/convex/_generated/dataModel";
import { WorkerTaskCard } from "@/components/features/WorkerTaskCard";

export default function TaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const assignmentId = params.taskId as unknown as Id<"assignments">;
  const assignment = useQuery(api.assignments.getAssignmentById, { assignmentId });
  if (assignment === undefined) return null;
  if (!assignment) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Task not found</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Task Detail</h1>
          <p className="text-muted-foreground">Assignment information and progress</p>
        </div>
        <WorkerTaskCard assignment={assignment} />
      </div>
    </DashboardLayout>
  );
}

