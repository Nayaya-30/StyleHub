// ============================================
// FILE: src/hooks/useOrders.ts
// ============================================

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { OrderStatus, PaymentStatus } from "@/types";

interface UseOrdersOptions {
	customerId?: Id<"users">;
	organizationId?: Id<"organizations">;
	workerId?: Id<"users">;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
	limit?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
	const { customerId, organizationId, workerId, status, paymentStatus, limit } = options;

	const customerOrders = useQuery(
		api.orders.getOrdersByCustomer,
		customerId
			? { customerId, status, limit }
			: "skip"
	);

	const organizationOrders = useQuery(
		api.orders.getOrdersByOrganization,
		organizationId
			? { organizationId, status, paymentStatus, limit }
			: "skip"
	);

	const workerOrders = useQuery(
		api.orders.getOrdersByWorker,
		workerId ? { workerId, status } : "skip"
	);

	const orders = customerOrders || organizationOrders || workerOrders || [];

	return {
		orders,
		isLoading: orders === undefined,
	};
}