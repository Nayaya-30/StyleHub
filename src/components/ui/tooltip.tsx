"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({ children, ...props }: TooltipPrimitive.TooltipContentProps) {
  return (
    <TooltipPrimitive.Content sideOffset={6} className="rounded bg-popover p-2 text-xs shadow-medium" {...props}>
      {children}
    </TooltipPrimitive.Content>
  );
}

