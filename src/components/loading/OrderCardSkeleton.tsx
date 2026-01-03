// ============================================
// FILE: src/components/loading/OrderCardSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function OrderCardSkeleton() {
	return (
		<Card className="p-6">
			<div className="flex gap-4">
				<Skeleton width={100} height={100} className="rounded-lg" />
				<div className="flex-1 space-y-3">
					<div className="flex justify-between items-start">
						<div className="space-y-2 flex-1">
							<Skeleton height={20} width="40%" />
							<Skeleton height={16} width="60%" />
						</div>
						<Skeleton height={20} width={80} />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton height={28} width={120} />
						<Skeleton height={16} width="30%" />
					</div>
					<div className="flex gap-2">
						<Skeleton height={36} width={100} />
						<Skeleton height={36} width={100} />
					</div>
				</div>
			</div>
		</Card>
	);
}

export function OrderListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<OrderCardSkeleton key={i} />
			))}
		</div>
	);
}