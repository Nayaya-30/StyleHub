// ============================================
// FILE: src/components/loading/TableSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
	return (
		<div className="border border-border rounded-lg overflow-hidden">
			{/* Header */}
			<div className="bg-muted border-b border-border">
				<div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
					{Array.from({ length: columns }).map((_, i) => (
						<Skeleton key={i} height={16} />
					))}
				</div>
			</div>

			{/* Rows */}
			<div className="divide-y divide-border">
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div
						key={rowIndex}
						className="grid gap-4 p-4"
						style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
					>
						{Array.from({ length: columns }).map((_, colIndex) => (
							<Skeleton key={colIndex} height={16} />
						))}
					</div>
				))}
			</div>
		</div>
	);
}