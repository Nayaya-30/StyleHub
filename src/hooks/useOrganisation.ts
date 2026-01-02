
// ============================================
// FILE: src/hooks/useOrganization.ts
// ============================================

import { useQuery } from "convex/react";
import { useOrganization as useClerkOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export function useOrganization() {
	const { organization: clerkOrg, isLoaded } = useClerkOrganization();

	const convexOrg = useQuery(
		api.organizations.getOrganizationByClerkId,
		clerkOrg?.id ? { clerkOrgId: clerkOrg.id } : "skip"
	);

	return {
		organization: convexOrg,
		clerkOrganization: clerkOrg,
		isLoading: !isLoaded || (clerkOrg && convexOrg === undefined),
		hasOrganization: !!clerkOrg,
	};
}