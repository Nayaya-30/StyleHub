// ============================================
// FILE: src/app/dashboard/orders/[orderId]/page.tsx
// ============================================

"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { OrderTrackingSkeleton } from "@/components/loading/OrderTrackingSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import {
	Package,
	CheckCircle,
	Clock,
	Scissors,
	Truck,
	MapPin,
	Phone,
	MessageSquare,
	Video,
	Star,
} from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { ORDER_STATUSES, PROGRESS_STAGES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
	params: Promise<{ orderId: string }>;
}

export default function OrderTrackingPage({ params }: PageProps) {
	const { orderId } = use(params);

	const order = useQuery(api.orders.getOrderById, {
		orderId: orderId as Id<"orders">,
	});

	const style = useQuery(
		api.styles.getStyleById,
		order?.styleId ? { styleId: order.styleId } : "skip"
	);

	const isLoading = order === undefined;

	if (isLoading) {
		return (
			<DashboardLayout>
				<SkeletonWrapper>
					<OrderTrackingSkeleton />
				</SkeletonWrapper>
			</DashboardLayout>
		);
	}

	if (!order) {
		return (
			<DashboardLayout>
				<div className="text-center py-12">
					<h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
					<Link href="/dashboard/orders">
						<Button>View All Orders</Button>
					</Link>
				</div>
			</DashboardLayout>
		);
	}

	const statusConfig = ORDER_STATUSES.find((s) => s.value === order.status);
	const completedStages = PROGRESS_STAGES.filter(
		(stage) => order.progress[stage.value as keyof typeof order.progress].status === "completed"
	).length;
	const progressPercentage = (completedStages / PROGRESS_STAGES.length) * 100;

	return (
		<DashboardLayout>
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
							<Badge variant={statusConfig?.color as "success" | "warning" | "error" | "info"}>
								{statusConfig?.label}
							</Badge>
						</div>
						<p className="text-muted-foreground">
							Placed on {formatDate(order.createdAt, "long")}
						</p>
					</div>
					<div className="flex gap-2">
						<Link href={`/messages?orderId=${order._id}`}>
							<Button variant="outline">
								<MessageSquare className="mr-2 h-4 w-4" />
								Message
							</Button>
						</Link>
						<Button variant="outline">
							<Video className="mr-2 h-4 w-4" />
							Huddle
						</Button>
					</div>
				</div>

				{/* Order Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent>
						{style && (
							<div className="flex gap-4 mb-6">
								{style.images[0] && (
									<div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
										<Image
											src={style.images[0].url}
											alt={style.title}
											fill
											className="object-cover"
											sizes="96px"
										/>
									</div>
								)}
								<div className="flex-1">
									<h3 className="font-semibold mb-1">{style.title}</h3>
									<p className="text-sm text-muted-foreground mb-2">{style.description}</p>
									<div className="text-lg font-bold">
										{formatCurrency(order.pricing.total, order.pricing.currency)}
									</div>
								</div>
							</div>
						)}

						<Separator className="my-6" />

						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Base Price</span>
								<span className="font-medium">
									{formatCurrency(order.pricing.basePrice, order.pricing.currency)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Customization Fee</span>
								<span className="font-medium">
									{formatCurrency(order.pricing.customizationFee, order.pricing.currency)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Delivery Fee</span>
								<span className="font-medium">
									{formatCurrency(order.pricing.deliveryFee, order.pricing.currency)}
								</span>
							</div>
							{order.pricing.discount > 0 && (
								<div className="flex justify-between text-success">
									<span>Discount</span>
									<span>-{formatCurrency(order.pricing.discount, order.pricing.currency)}</span>
								</div>
							)}
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Total</span>
								<span>{formatCurrency(order.pricing.total, order.pricing.currency)}</span>
							</div>
						</div>

						<div className="mt-6 p-4 bg-accent/50 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="font-semibold">Payment Status</span>
								<Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
									{order.paymentStatus}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Progress Timeline */}
				{order.status === "in_progress" && (
					<Card>
						<CardHeader>
							<CardTitle>Production Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-8">
								{PROGRESS_STAGES.map((stage, index) => {
									const stageData = order.progress[stage.value as keyof typeof order.progress];
									const isCompleted = stageData.status === "completed";
									const isInProgress = stageData.status === "in_progress";
									const isPending = stageData.status === "pending";

									return (
										<div key={stage.value} className="flex gap-4">
											<div className="flex flex-col items-center">
												<div
													className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${isCompleted
															? "bg-success-100 border-success-500 text-success-700"
															: isInProgress
																? "bg-blue-100 border-blue-500 text-blue-700"
																: "bg-muted border-border text-muted-foreground"
														}`}
												>
													{isCompleted ? (
														<CheckCircle className="h-6 w-6" />
													) : isInProgress ? (
														<Clock className="h-6 w-6 animate-pulse" />
													) : (
														<Scissors className="h-6 w-6" />
													)}
												</div>
												{index < PROGRESS_STAGES.length - 1 && (
													<div
														className={`w-0.5 h-16 ${isCompleted ? "bg-success-500" : "bg-border"
															}`}
													/>
												)}
											</div>

											<div className="flex-1 pb-8">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h3 className="font-semibold text-lg capitalize">{stage.label}</h3>
														{stageData.notes && (
															<p className="text-sm text-muted-foreground mt-1">
																{stageData.notes}
															</p>
														)}
													</div>
													{stageData.completedAt && (
														<span className="text-sm text-muted-foreground">
															{formatDate(stageData.completedAt, "short")}
														</span>
													)}
												</div>

												{stageData.images && stageData.images.length > 0 && (
													<div className="flex gap-2 mt-3">
														{stageData.images.map((image, i) => (
															<div
																key={i}
																className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted"
															>
																<Image src={image} alt={`Progress ${i + 1}`} fill className="object-cover" sizes="80px" />
															</div>
														))}
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Delivery Information */}
				<Card>
					<CardHeader>
						<CardTitle>Delivery Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div>
								<div className="font-medium mb-1">Delivery Address</div>
								<div className="text-muted-foreground">{order.delivery.address}</div>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
							<div>
								<div className="font-medium mb-1">Contact Phone</div>
								<div className="text-muted-foreground">{order.delivery.phone}</div>
							</div>
						</div>

						{order.delivery.trackingNumber && (
							<div className="flex items-start gap-3">
								<Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<div className="font-medium mb-1">Tracking Number</div>
									<div className="font-mono text-muted-foreground">
										{order.delivery.trackingNumber}
									</div>
								</div>
							</div>
						)}

						{order.delivery.estimatedDate && (
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<div className="font-medium mb-1">Estimated Delivery</div>
									<div className="text-muted-foreground">
										{formatDate(order.delivery.estimatedDate, "long")}
									</div>
								</div>
							</div>
						)}

						<div className="pt-4 border-t">
							<div className="flex items-center justify-between">
								<span className="font-medium">Delivery Status</span>
								<Badge variant={order.delivery.status === "delivered" ? "success" : "info"}>
									{order.delivery.status.replace("_", " ")}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Review */}
				{order.status === "delivered" && !order.rating && (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<Star className="h-12 w-12 text-warning mx-auto" />
								<div>
									<h3 className="font-semibold text-lg mb-2">Rate Your Experience</h3>
									<p className="text-muted-foreground">
										Help others by sharing your experience with this order
									</p>
								</div>
								<Button>Write a Review</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}