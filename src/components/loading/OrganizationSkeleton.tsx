// ============================================
// FILE: src/components/loading/OrganizationSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";
import { StyleGridSkeleton } from "@/components/loading/StyleCardSkeleton";

export function OrganizationHeaderSkeleton() {
	return (
		<div className="relative">
			<Skeleton height={200} className="rounded-t-lg" />
			<Card className="relative -mt-16 mx-6 p-6">
				<div className="flex items-end gap-6">
					<Skeleton circle width={120} height={120} className="border-4 border-background" />
					<div className="flex-1 space-y-3">
						<Skeleton height={32} width="50%" />
						<Skeleton height={20} width="70%" />
						<div className="flex gap-4">
							<Skeleton height={16} width={120} />
							<Skeleton height={16} width={120} />
							<Skeleton height={16} width={120} />
						</div>
					</div>
					<Skeleton height={44} width={120} />
				</div>
			</Card>
		</div>
	);
}

export function OrganizationShowcaseSkeleton() {
	return (
		<div className="space-y-6">
			<OrganizationHeaderSkeleton />

			{/* Tabs */}
			<div className="flex gap-2 border-b border-border px-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} height={40} width={100} />
				))}
			</div>

			{/* Grid */}
			<div className="px-6">
				<StyleGridSkeleton count={8} />
			</div>
		</div>
	);
}
