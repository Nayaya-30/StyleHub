// ============================================
// FILE: src/hooks/useStyles.ts
// ============================================

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { StyleGender } from "@/types";

interface UseStylesOptions {
	organizationId?: Id<"organizations">;
	category?: string;
	gender?: StyleGender;
	featured?: boolean;
	minPrice?: number;
	maxPrice?: number;
	sortBy?: "newest" | "popular" | "price-low" | "price-high";
	limit?: number;
}

export function useStyles(options: UseStylesOptions = {}) {
	const {
		organizationId,
		category,
		gender,
		featured,
		minPrice,
		maxPrice,
		sortBy,
		limit,
	} = options;

	const orgStyles = useQuery(
		api.styles.getStylesByOrganization,
		organizationId
			? { organizationId, isActive: true, limit }
			: "skip"
	);

	const categoryStyles = useQuery(
		api.styles.getStylesByCategory,
		category && !organizationId
			? { category, gender, limit }
			: "skip"
	);

	const featuredStyles = useQuery(
		api.styles.getFeaturedStyles,
		featured && !organizationId && !category
			? { limit }
			: "skip"
	);

	const allStyles = useQuery(
		api.styles.getActiveStyles,
		!organizationId && !category && !featured
			? { category, gender, minPrice, maxPrice, sortBy, limit }
			: "skip"
	);

	const styles = orgStyles || categoryStyles || featuredStyles || allStyles || [];

	return {
		styles,
		isLoading: styles === undefined,
	};
}