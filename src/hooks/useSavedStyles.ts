// ============================================
// FILE: src/hooks/useSavedStyles.ts
// ============================================

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useSavedStyles(userId: Id<"users"> | undefined) {
	const savedStyles = useQuery(
		api.savedStyles.getSavedStylesByUser,
		userId ? { userId } : "skip"
	);

	const saveStyle = useMutation(api.savedStyles.saveStyle);
	const unsaveStyle = useMutation(api.savedStyles.unsaveStyle);

	const isStyleSaved = (styleId: Id<"styles">) => {
		return savedStyles?.some((s) => s.styleId === styleId) || false;
	};

	return {
		savedStyles: savedStyles || [],
		saveStyle,
		unsaveStyle,
		isStyleSaved,
		isLoading: savedStyles === undefined,
	};
}