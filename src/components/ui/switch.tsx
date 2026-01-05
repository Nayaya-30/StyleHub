"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type Props = SwitchPrimitive.SwitchProps & { label?: string };

export function Switch({ className, label, ...props }: Props) {
  return (
    <label className={cn("flex items-center gap-2", className)}>
      <SwitchPrimitive.Root className="inline-flex h-5 w-9 items-center rounded-full bg-muted data-[state=checked]:bg-primary" {...props}>
        <SwitchPrimitive.Thumb className="ml-0.5 h-4 w-4 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4" />
      </SwitchPrimitive.Root>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

