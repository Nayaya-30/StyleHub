// ============================================
// FILE: src/app/dashboard/tasks/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkerTaskCard } from "@/components/features/WorkerTaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { AssignmentStatus } from "@/types";

export default function TasksPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<AssignmentStatus | "all">("all");

  const assignments = useQuery(
    api.assignments.getAssignmentsByWorker,
    user?._id
      ? {
          workerId: user._id,
          status: activeTab === "all" ? undefined : activeTab,
        }
      : "skip"
  );

  const allAssignments = useQuery(
    api.assignments.getAssignmentsByWorker,
    user?._id ? { workerId: user._id } : "skip"
  );

  const isLoading = assignments === undefined || allAssignments === undefined;

  const stats = {
    pending: allAssignments?.filter((a) => a.status === "pending").length || 0,
    inProgress: allAssignments?.filter((a) => a.status === "in_progress").length || 0,
    completed: allAssignments?.filter((a) => a.status === "completed").length || 0,
    efficiency: user?.stats?.efficiency || 0,
  };

  const tabs = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your assigned tasks and track progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Efficiency
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.efficiency}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <SkeletonWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-20 bg-muted rounded animate-pulse" />
                      </div>
                    </Card>
                  ))}
                </div>
              </SkeletonWrapper>
            ) : assignments && assignments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignments.map((assignment) => (
                  <WorkerTaskCard key={assignment._id} assignment={assignment} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No tasks found"
                description={
                  activeTab === "all"
                    ? "You don't have any assigned tasks yet"
                    : `No ${activeTab.replace("_", " ")} tasks`
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}