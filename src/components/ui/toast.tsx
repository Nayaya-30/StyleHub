"use client";
import { toast as sonner } from "sonner";

type ToastOptions = { description?: string; actionLabel?: string; onAction?: () => void };

export function toast(title: string, options?: ToastOptions) {
  sonner(title, {
    description: options?.description,
    action: options?.actionLabel ? { label: options.actionLabel, onClick: options.onAction } : undefined,
    duration: 4000,
  });
}

