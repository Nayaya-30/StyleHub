// ============================================
// FILE: src/components/forms/OrderForm.tsx
// ============================================

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeasurementsForm } from "./MeasurementsForm";
import { CreateOrderInput } from "@/types";

const orderSchema = z.object({
	measurements: z.object({
		chest: z.number().positive().optional(),
		waist: z.number().positive().optional(),
		hips: z.number().positive().optional(),
		shoulder: z.number().positive().optional(),
		length: z.number().positive().optional(),
		sleeve: z.number().positive().optional(),
		neck: z.number().positive().optional(),
		inseam: z.number().positive().optional(),
		unit: z.enum(["cm", "inches"]),
	}),
	additionalNotes: z.string().optional(),
	customizationRequests: z.string().optional(),
	deliveryAddress: z.string().min(1, "Delivery address is required"),
	deliveryPhone: z.string().min(10, "Valid phone number required"),
	deliveryInstructions: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
	styleId: string;
	requiredMeasurements: string[];
	basePrice: number;
	currency: string;
	onSubmit: (data: OrderFormData) => void;
	isLoading?: boolean;
}

export function OrderForm({
	styleId,
	requiredMeasurements,
	basePrice,
	currency,
	onSubmit,
	isLoading = false,
}: OrderFormProps) {
	const form = useForm<OrderFormData>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			measurements: {
				unit: "cm",
			},
			additionalNotes: "",
			customizationRequests: "",
			deliveryAddress: "",
			deliveryPhone: "",
			deliveryInstructions: "",
		},
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			{/* Measurements */}
			<Card>
				<CardHeader>
					<CardTitle>Measurements</CardTitle>
				</CardHeader>
				<CardContent>
					<MeasurementsForm
						requiredFields={requiredMeasurements}
						onSubmit={(data) => form.setValue("measurements", data)}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>

			{/* Additional Details */}
			<Card>
				<CardHeader>
					<CardTitle>Additional Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						form={form}
						name="customizationRequests"
						label="Customization Requests"
						description="Describe any specific modifications or preferences"
					>
						<Textarea
							placeholder="E.g., prefer slim fit, specific button style..."
							{...form.register("customizationRequests")}
						/>
					</FormField>

					<FormField
						form={form}
						name="additionalNotes"
						label="Additional Notes"
						description="Any other information we should know"
					>
						<Textarea
							placeholder="Additional comments..."
							{...form.register("additionalNotes")}
						/>
					</FormField>
				</CardContent>
			</Card>

			{/* Delivery Information */}
			<Card>
				<CardHeader>
					<CardTitle>Delivery Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						form={form}
						name="deliveryAddress"
						label="Delivery Address"
						required
					>
						<Textarea
							placeholder="Enter your full delivery address"
							{...form.register("deliveryAddress")}
						/>
					</FormField>

					<FormField
						form={form}
						name="deliveryPhone"
						label="Contact Phone"
						required
					>
						<Input
							type="tel"
							placeholder="+234 XXX XXX XXXX"
							{...form.register("deliveryPhone")}
						/>
					</FormField>

					<FormField
						form={form}
						name="deliveryInstructions"
						label="Delivery Instructions"
						description="Special instructions for delivery"
					>
						<Textarea
							placeholder="E.g., call before delivery, leave at security..."
							{...form.register("deliveryInstructions")}
						/>
					</FormField>
				</CardContent>
			</Card>

			<Button type="submit" size="lg" loading={isLoading} className="w-full">
				Place Order
			</Button>
		</form>
	);
}
