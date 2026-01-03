// ============================================
// FILE: src/components/loading/OrderTrackingSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function OrderTrackingSkeleton() {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<Card className="p-6">
				<div className="flex justify-between items-start mb-4">
					<div className="space-y-2 flex-1">
						<Skeleton height={32} width="40%" />
						<Skeleton height={20} width="30%" />
					</div>
					<div className="text-right space-y-2">
						<Skeleton height={16} width={120} />
						<Skeleton height={28} width={150} />
					</div>
				</div>
				<div className="grid grid-cols-3 gap-4 mt-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="space-y-1">
							<Skeleton height={14} width={80} />
							<Skeleton height={24} width="100%" />
						</div>
					))}
				</div>
			</Card>

			{/* Progress Timeline */}
			<Card className="p-6">
				<Skeleton height={24} width={200} className="mb-6" />
				<div className="space-y-8">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex gap-4">
							<div className="flex flex-col items-center">
								<Skeleton circle width={48} height={48} />
								{i < 5 && <Skeleton width={2} height={48} />}
							</div>
							<div className="flex-1 pb-8">
								<div className="flex justify-between items-start mb-2">
									<div className="space-y-2 flex-1">
										<Skeleton height={20} width={150} />
										<Skeleton height={16} width={100} />
									</div>
									<Skeleton height={16} width={100} />
								</div>
								{i % 2 === 0 && (
									<div className="mt-2">
										<Skeleton height={12} width="40%" className="mb-1" />
										<Skeleton height={8} />
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</Card>

			{/* Delivery Info */}
			<Card className="p-6">
				<Skeleton height={24} width={200} className="mb-4" />
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex justify-between">
							<Skeleton height={16} width={150} />
							<Skeleton height={16} width="40%" />
						</div>
					))}
				</div>
			</Card>

			{/* Actions */}
			<div className="flex gap-4">
				<Skeleton height={48} className="flex-1" />
				<Skeleton height={48} className="flex-1" />
			</div>
		</div>
	);
}