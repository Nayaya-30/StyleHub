// ============================================
// FILE: src/components/features/WorkerTaskCard.tsx
// ============================================

"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User } from "lucide-react";
import { Assignment, Order } from "@/types";
import { formatDate, formatDuration } from "@/lib/format";
import { PRIORITY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WorkerTaskCardProps {
  assignment: Assignment;
  order?: Order;
}

export function WorkerTaskCard({ assignment, order }: WorkerTaskCardProps) {
  const priorityConfig = PRIORITY_LEVELS.find((p) => p.value === assignment.priority);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "completed":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getDaysUntilDue = () => {
    if (!order?.delivery.estimatedDate) return null;
    const now = Date.now();
    const dueDate = order.delivery.estimatedDate;
    const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-medium",
      assignment.priority === "urgent" && "border-error-500"
    )}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold font-mono">
                {order?.orderNumber || "Order"}
              </h3>
              <Badge
                variant={getStatusColor(assignment.status) as "success" | "warning" | "error" | "info"}
                size="sm"
              >
                {assignment.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{assignment.stage}</span>
              <span>•</span>
              <Badge
                variant="outline"
                size="sm"
                className={cn(
                  priorityConfig?.value === "urgent" && "border-error text-error",
                  priorityConfig?.value === "high" && "border-warning text-warning"
                )}
              >
                {priorityConfig?.label} Priority
              </Badge>
            </div>
          </div>
        </div>

        {/* Notes */}
        {assignment.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {assignment.notes}
          </p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground text-xs">Assigned</div>
              <div className="font-medium">{formatDate(assignment.assignedAt, "short")}</div>
            </div>
          </div>
          {daysUntilDue !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground text-xs">Due in</div>
                <div className={cn(
                  "font-medium",
                  daysUntilDue <= 2 && "text-error",
                  daysUntilDue <= 5 && daysUntilDue > 2 && "text-warning"
                )}>
                  {daysUntilDue} days
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Progress Updates Count */}
        {assignment.progressUpdates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {assignment.progressUpdates.length} progress update
            {assignment.progressUpdates.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/dashboard/tasks/${assignment._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          {assignment.status === "pending" && (
            <Button size="sm" className="flex-1">
              Start Task
            </Button>
          )}
          {assignment.status === "in_progress" && (
            <Button size="sm" className="flex-1">
              Update Progress
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}