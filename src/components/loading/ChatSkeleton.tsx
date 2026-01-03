// ============================================
// FILE: src/components/loading/ChatSkeleton.tsx
// ============================================

import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export function ChatSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
			{/* Conversations List */}
			<Card className="overflow-hidden">
				<div className="p-4 border-b border-border">
					<Skeleton height={20} width={100} />
				</div>
				<div className="divide-y divide-border">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="p-4 flex gap-3">
							<Skeleton circle width={48} height={48} />
							<div className="flex-1 space-y-2">
								<div className="flex justify-between">
									<Skeleton height={16} width="60%" />
									<Skeleton height={12} width={40} />
								</div>
								<Skeleton height={14} width="80%" />
							</div>
						</div>
					))}
				</div>
			</Card>

			{/* Chat Window */}
			<Card className="lg:col-span-2 flex flex-col">
				{/* Header */}
				<div className="p-4 border-b border-border flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Skeleton circle width={40} height={40} />
						<div className="space-y-1">
							<Skeleton height={16} width={150} />
							<Skeleton height={12} width={100} />
						</div>
					</div>
					<div className="flex gap-2">
						<Skeleton circle width={40} height={40} />
						<Skeleton circle width={40} height={40} />
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 p-4 space-y-4 overflow-y-auto">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
						>
							<div className={`max-w-[70%] ${i % 2 === 0 ? "" : "ml-auto"}`}>
								<Skeleton height={60} width={250} className="rounded-lg" />
							</div>
						</div>
					))}
				</div>

				{/* Input */}
				<div className="p-4 border-t border-border">
					<div className="flex gap-2">
						<Skeleton height={44} className="flex-1" />
						<Skeleton height={44} width={80} />
					</div>
				</div>
			</Card>
		</div>
	);
}