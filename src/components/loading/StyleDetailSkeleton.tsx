// ============================================
// FILE: src/components/loading/StyleDetailSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function StyleDetailSkeleton() {
	return (
		<div className="container-custom py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left: Images */}
				<div className="space-y-4">
					<Skeleton height={600} className="rounded-lg" />
					<div className="grid grid-cols-4 gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} height={100} className="rounded-lg" />
						))}
					</div>
				</div>

				{/* Right: Details */}
				<div className="space-y-6">
					<div>
						<Skeleton height={40} width="80%" className="mb-2" />
						<div className="flex items-center gap-2 mb-4">
							<Skeleton circle width={32} height={32} />
							<Skeleton height={20} width={150} />
						</div>
						<Skeleton height={36} width={120} className="mb-4" />
						<Skeleton height={80} />
					</div>

					<Card className="p-6 space-y-4">
						<Skeleton height={24} width={200} />
						<div className="grid grid-cols-2 gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i}>
									<Skeleton height={16} width={80} className="mb-2" />
									<Skeleton height={44} />
								</div>
							))}
						</div>
						<div>
							<Skeleton height={16} width={120} className="mb-2" />
							<Skeleton height={100} />
						</div>
						<Card className="p-4 space-y-2">
							<div className="flex justify-between">
								<Skeleton height={16} width={100} />
								<Skeleton height={16} width={80} />
							</div>
							<div className="flex justify-between">
								<Skeleton height={16} width={120} />
								<Skeleton height={16} width={80} />
							</div>
							<div className="flex justify-between">
								<Skeleton height={16} width={100} />
								<Skeleton height={16} width={80} />
							</div>
							<div className="flex justify-between pt-2 border-t">
								<Skeleton height={20} width={80} />
								<Skeleton height={20} width={100} />
							</div>
						</Card>
					</Card>

					<div className="flex gap-4">
						<Skeleton height={48} className="flex-1" />
						<Skeleton height={48} width={120} />
					</div>
				</div>
			</div>
		</div>
	);
}