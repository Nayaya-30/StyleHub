// ============================================
// FILE: src/components/forms/StyleForm.tsx
// ============================================

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, GENDERS } from "@/lib/constants";
import { CreateStyleInput } from "@/types";

const styleSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(1, "Category is required"),
	subCategory: z.string().min(1, "Sub-category is required"),
	gender: z.enum(["men", "women", "kids", "unisex"]),
	basePrice: z.number().positive("Price must be positive"),
	currency: z.string().default("NGN"),
	isNegotiable: z.boolean().default(false),
	tags: z.string().transform((val) => val.split(",").map((t) => t.trim()).filter(Boolean)),
});

type StyleFormData = z.infer<typeof styleSchema>;

interface StyleFormProps {
	organizationId: string;
	onSubmit: (data: StyleFormData) => void;
	defaultValues?: Partial<StyleFormData>;
	isLoading?: boolean;
}

export function StyleForm({
	organizationId,
	onSubmit,
	defaultValues,
	isLoading = false,
}: StyleFormProps) {
	const form = useForm<StyleFormData>({
		resolver: zodResolver(styleSchema),
		defaultValues: {
			currency: "NGN",
			isNegotiable: false,
			...defaultValues,
		},
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<Card>
				<CardContent className="pt-6 space-y-4">
					<FormField form={form} name="title" label="Style Name" required>
						<Input placeholder="E.g., Classic Agbada" {...form.register("title")} />
					</FormField>

					<FormField
						form={form}
						name="description"
						label="Description"
						description="Detailed description of the style"
						required
					>
						<Textarea
							placeholder="Describe the style, materials, and features..."
							rows={4}
							{...form.register("description")}
						/>
					</FormField>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField form={form} name="category" label="Category" required>
							<Select onValueChange={(value) => form.setValue("category", value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{CATEGORIES.map((cat) => (
										<SelectItem key={cat.value} value={cat.value}>
											{cat.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						<FormField form={form} name="subCategory" label="Sub-Category" required>
							<Input
								placeholder="E.g., Shirts, Dresses"
								{...form.register("subCategory")}
							/>
						</FormField>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField form={form} name="gender" label="Gender" required>
							<Select onValueChange={(value) => form.setValue("gender", value as "men" | "women" | "kids" | "unisex")}>
								<SelectTrigger>
									<SelectValue placeholder="Select gender" />
								</SelectTrigger>
								<SelectContent>
									{GENDERS.map((gender) => (
										<SelectItem key={gender.value} value={gender.value}>
											{gender.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormField>

						<FormField form={form} name="basePrice" label="Base Price" required>
							<Input
								type="number"
								step="0.01"
								placeholder="0.00"
								{...form.register("basePrice", { valueAsNumber: true })}
							/>
						</FormField>
					</div>

					<FormField
						form={form}
						name="tags"
						label="Tags"
						description="Comma-separated tags for better searchability"
					>
						<Input
							placeholder="traditional, wedding, formal"
							{...form.register("tags")}
						/>
					</FormField>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="isNegotiable"
							className="h-4 w-4"
							{...form.register("isNegotiable")}
						/>
						<label htmlFor="isNegotiable" className="text-sm font-medium">
							Price is negotiable
						</label>
					</div>
				</CardContent>
			</Card>

			<Button type="submit" size="lg" loading={isLoading} className="w-full">
				Create Style
			</Button>
		</form>
	);
}