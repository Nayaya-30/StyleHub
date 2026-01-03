// ============================================
// FILE: src/components/loading/DashboardSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function StatCardSkeleton() {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton circle width={48} height={48} />
			</div>
			<Skeleton height={32} width="60%" className="mb-2" />
			<Skeleton height={16} width="80%" />
		</Card>
	);
}

export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<StatCardSkeleton key={i} />
			))}
		</div>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<Skeleton height={32} width={300} />
				<Skeleton height={20} width={200} />
			</div>

			{/* Stats */}
			<DashboardStatsSkeleton />

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column */}
				<div className="lg:col-span-2 space-y-6">
					<Card className="p-6">
						<Skeleton height={24} width={200} className="mb-4" />
						<Skeleton height={300} />
					</Card>

					<Card className="p-6">
						<Skeleton height={24} width={200} className="mb-4" />
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
									<Skeleton width={60} height={60} className="rounded-lg" />
									<div className="flex-1 space-y-2">
										<Skeleton height={16} width="80%" />
										<Skeleton height={14} width="60%" />
									</div>
									<Skeleton height={32} width={80} />
								</div>
							))}
						</div>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					<Card className="p-6">
						<Skeleton height={24} width={150} className="mb-4" />
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center gap-3">
									<Skeleton circle width={10} height={10} />
									<Skeleton height={14} width="100%" />
								</div>
							))}
						</div>
					</Card>

					<Card className="p-6">
						<Skeleton height={24} width={150} className="mb-4" />
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i}>
									<div className="flex justify-between mb-2">
										<Skeleton height={14} width={100} />
										<Skeleton height={14} width={40} />
									</div>
									<Skeleton height={8} />
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}