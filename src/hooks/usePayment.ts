// ============================================
// FILE: src/hooks/usePayment.ts
// ============================================

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePayment() {
	const [isProcessing, setIsProcessing] = useState(false);
	const initializePayment = useAction(api.actions.initializePayment);
	const verifyPayment = useAction(api.actions.verifyPayment);

	const processPayment = async (
		orderId: Id<"orders">,
		amount: number,
		currency: string,
		customerEmail: string,
		customerName: string,
		customerPhone: string
	) => {
		setIsProcessing(true);

		try {
			const result = await initializePayment({
				orderId,
				amount,
				currency,
				customerEmail,
				customerName,
				customerPhone,
			});

			return result;
		} catch (error) {
			console.error("Payment initialization failed:", error);
			throw error;
		} finally {
			setIsProcessing(false);
		}
	};

	const verify = async (transactionId: string, txRef: string) => {
		setIsProcessing(true);

		try {
			const result = await verifyPayment({ transactionId, txRef });
			return result;
		} catch (error) {
			console.error("Payment verification failed:", error);
			throw error;
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		processPayment,
		verifyPayment: verify,
		isProcessing,
	};
}