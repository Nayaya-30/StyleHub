"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = ({ className, ...props }: PopoverPrimitive.PopoverContentProps) => (
  <PopoverPrimitive.Content className={cn("z-50 rounded-lg border bg-popover p-4 shadow-medium", className)} {...props} />
);

