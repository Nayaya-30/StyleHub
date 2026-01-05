"use client";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

type Props = CheckboxPrimitive.CheckboxProps & { label?: string };

export function Checkbox({ className, label, ...props }: Props) {
  return (
    <label className={cn("flex items-center gap-2", className)}>
      <CheckboxPrimitive.Root className="h-4 w-4 rounded border border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" {...props}>
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">✓</CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

