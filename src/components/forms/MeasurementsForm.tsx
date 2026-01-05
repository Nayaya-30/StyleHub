// ============================================
// FILE: src/components/forms/MeasurementsForm.tsx
// ============================================

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { MeasurementUnit } from "@/types";
import { REQUIRED_MEASUREMENTS, OPTIONAL_MEASUREMENTS } from "@/lib/constants";
import { useState } from "react";

const measurementSchema = z.object({
	chest: z.number().positive().optional(),
	waist: z.number().positive().optional(),
	hips: z.number().positive().optional(),
	shoulder: z.number().positive().optional(),
	length: z.number().positive().optional(),
	sleeve: z.number().positive().optional(),
	neck: z.number().positive().optional(),
	inseam: z.number().positive().optional(),
	unit: z.enum(["cm", "inches"]),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface MeasurementsFormProps {
	requiredFields?: string[];
	onSubmit: (data: MeasurementFormData) => void;
	defaultValues?: Partial<MeasurementFormData>;
	isLoading?: boolean;
}

export function MeasurementsForm({
	requiredFields = ["chest", "waist", "shoulder", "length"],
	onSubmit,
	defaultValues,
	isLoading = false,
}: MeasurementsFormProps) {
	const [unit, setUnit] = useState<MeasurementUnit>(defaultValues?.unit || "cm");

	const form = useForm<MeasurementFormData>({
		resolver: zodResolver(measurementSchema),
		defaultValues: {
			unit: "cm",
			...defaultValues,
		},
	});

	const handleUnitChange = (newUnit: MeasurementUnit) => {
		setUnit(newUnit);
		form.setValue("unit", newUnit);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			{/* Unit Selector */}
			<Card className="p-4 bg-accent/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Info className="h-5 w-5 text-muted-foreground" />
						<span className="font-semibold">Measurement Unit</span>
					</div>
					<Tabs value={unit} onValueChange={handleUnitChange as (value: string) => void}>
						<TabsList>
							<TabsTrigger value="cm">Centimeters</TabsTrigger>
							<TabsTrigger value="inches">Inches</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</Card>

			{/* Required Measurements */}
			<div className="space-y-4">
				<h3 className="font-semibold text-lg">Required Measurements</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{REQUIRED_MEASUREMENTS.filter((m) => requiredFields.includes(m.key)).map(
						(measurement) => (
							<FormField
								key={measurement.key}
								form={form}
								name={measurement.key as Path<MeasurementFormData>}
								label={measurement.label}
								required
							>
								<Input
									type="number"
									step="0.1"
									placeholder={`Enter ${measurement.label.toLowerCase()}`}
									{...form.register(measurement.key as Path<MeasurementFormData>, {
										valueAsNumber: true,
									})}
								/>
							</FormField>
						)
					)}
				</div>
			</div>

			{/* Optional Measurements */}
			<div className="space-y-4">
				<h3 className="font-semibold text-lg">Optional Measurements</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{OPTIONAL_MEASUREMENTS.map((measurement) => (
						<FormField
							key={measurement.key}
							form={form}
							name={measurement.key as Path<MeasurementFormData>}
							label={measurement.label}
						>
							<Input
								type="number"
								step="0.1"
								placeholder={`Enter ${measurement.label.toLowerCase()}`}
								{...form.register(measurement.key as Path<MeasurementFormData>, {
									valueAsNumber: true,
								})}
							/>
						</FormField>
					))}
				</div>
			</div>

			<Button type="submit" loading={isLoading} className="w-full">
				Save Measurements
			</Button>
		</form>
	);
}