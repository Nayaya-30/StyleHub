// ============================================
// FILE: src/components/loading/StyleCardSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function StyleCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<Skeleton height={320} className="rounded-t-lg" />
			<div className="p-4 space-y-3">
				<Skeleton height={24} width="80%" />
				<div className="flex items-center gap-2">
					<Skeleton circle width={24} height={24} />
					<Skeleton height={16} width="60%" />
				</div>
				<div className="flex items-center justify-between">
					<Skeleton height={20} width={80} />
					<Skeleton circle width={32} height={32} />
				</div>
				<div className="flex gap-2">
					<Skeleton height={24} width={60} />
					<Skeleton height={24} width={60} />
				</div>
			</div>
		</Card>
	);
}

export function StyleGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<StyleCardSkeleton key={i} />
			))}
		</div>
	);
}