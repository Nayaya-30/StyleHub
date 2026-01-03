// ============================================
// FILE: src/components/features/OrderCard.tsx
// ============================================

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Package, Phone } from "lucide-react";
import { Order, Style } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderCardProps {
  order: Order;
  style?: Style;
  showActions?: boolean;
}

export function OrderCard({ order, style, showActions = true }: OrderCardProps) {
  const statusConfig = ORDER_STATUSES.find((s) => s.value === order.status);
  
  const getProgressPercentage = () => {
    const stages = ["cutting", "sewing", "finishing"];
    const completedStages = stages.filter(
      (stage) => order.progress[stage as keyof typeof order.progress].status === "completed"
    ).length;
    return (completedStages / stages.length) * 100;
  };

  const getCurrentStageLabel = () => {
    if (order.progress.finishing.status === "in_progress") return "Finishing";
    if (order.progress.sewing.status === "in_progress") return "Sewing";
    if (order.progress.cutting.status === "in_progress") return "Cutting";
    return "Pending";
  };

  return (
    <Card className="overflow-hidden hover-scale">
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        {/* Image */}
        {style?.images[0] && (
          <Link href={`/orders/${order._id}`} className="flex-shrink-0">
            <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-muted">
              <Image
                src={style.images[0].url}
                alt={style.title}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          </Link>
        )}

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <Link href={`/orders/${order._id}`}>
                <h3 className="font-semibold hover:text-primary transition-colors font-mono">
                  {order.orderNumber}
                </h3>
              </Link>
              {style && (
                <p className="text-sm text-muted-foreground">{style.title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Placed on {formatDate(order.createdAt, "short")}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {formatCurrency(order.pricing.total, order.pricing.currency)}
              </div>
              <Badge
                variant={statusConfig?.color as "success" | "warning" | "error" | "info"}
                size="sm"
              >
                {statusConfig?.label || order.status}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          {order.status === "in_progress" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{getCurrentStageLabel()}</span>
                <span className="font-semibold">{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} />
            </div>
          )}

          {/* Delivery Info */}
          {order.delivery.estimatedDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                Expected delivery: {formatDate(order.delivery.estimatedDate, "short")}
              </span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex flex-wrap gap-2">
              <Link href={`/orders/${order._id}`}>
                <Button size="sm" variant="outline">
                  Track Order
                </Button>
              </Link>
              <Link href={`/messages?orderId=${order._id}`}>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}