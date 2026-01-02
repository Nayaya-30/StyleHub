// ============================================
// FILE: src/hooks/useAssignments.ts
// ============================================

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AssignmentStatus } from "@/types";

export function useAssignments(
	workerId: Id<"users"> | undefined,
	status?: AssignmentStatus
) {
	const assignments = useQuery(
		api.assignments.getAssignmentsByWorker,
		workerId ? { workerId, status } : "skip"
	);

	return {
		assignments: assignments || [],
		isLoading: assignments === undefined,
	};
}