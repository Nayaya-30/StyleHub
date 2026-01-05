"use client";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = ({ className, children, ...props }: AlertDialogPrimitive.AlertDialogContentProps) => (
  <AlertDialogPrimitive.Content className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", className)} {...props}>
    <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-medium">
      {children}
    </div>
  </AlertDialogPrimitive.Content>
);
export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4", className)} {...props} />
);
export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />
);
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogCancel = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button variant="outline" {...props}>{children}</Button>
  </AlertDialogPrimitive.Cancel>
);
export const AlertDialogAction = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <AlertDialogPrimitive.Action asChild>
    <Button {...props}>{children}</Button>
  </AlertDialogPrimitive.Action>
);

