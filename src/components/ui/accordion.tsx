"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = ({ className, ...props }: AccordionPrimitive.AccordionItemProps) => (
  <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
);
export const AccordionTrigger = ({ className, children, ...props }: AccordionPrimitive.AccordionTriggerProps) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger className={cn("flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline", className)} {...props}>
      {children}
      <span className="ml-2 h-4 w-4" aria-hidden>
        ▼
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
export const AccordionContent = ({ className, children, ...props }: AccordionPrimitive.AccordionContentProps) => (
  <AccordionPrimitive.Content className={cn("pb-4 text-sm", className)} {...props}>
    {children}
  </AccordionPrimitive.Content>
);

