// ============================================
// FILE: src/components/ui/skeleton-loader.tsx
// ============================================

"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "next-themes";

interface SkeletonWrapperProps {
	children: React.ReactNode;
}

export function SkeletonWrapper({ children }: SkeletonWrapperProps) {
	const { theme } = useTheme();

	return (
		<SkeletonTheme
			baseColor={theme === "dark" ? "#1f1f1f" : "#f7f7f5"}
			highlightColor={theme === "dark" ? "#2a2a2a" : "#e5e5e0"}
			borderRadius="0.5rem"
			duration={1.5}
		>
			{children}
		</SkeletonTheme>
	);
}