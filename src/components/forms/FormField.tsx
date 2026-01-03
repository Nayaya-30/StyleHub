// ============================================
// FILE: src/components/forms/FormField.tsx
// ============================================

"use client";

import { ReactNode } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	name: Path<T>;
	label: string;
	description?: string;
	required?: boolean;
	children?: ReactNode;
}

export function FormField<T extends FieldValues>({
	form,
	name,
	label,
	description,
	required,
	children,
}: FormFieldProps<T>) {
	const error = form.formState.errors[name]?.message as string | undefined;

	return (
		<div className="space-y-2">
			<Label htmlFor={name} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-error")}>
				{label}
			</Label>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
			{children}
			{error && (
				<p className="text-sm text-error">{error}</p>
			)}
		</div>
	);
}