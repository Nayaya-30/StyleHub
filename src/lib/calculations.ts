// ============================================
// FILE: src/lib/calculations.ts
// ============================================

import type { OrderPricing, CustomizationOption } from "@/types";

/**
 * Calculate order pricing
 */
export function calculateOrderPricing(
  basePrice: number,
  customizationFee: number,
  deliveryFee: number,
  discount: number = 0,
  taxRate: number = 0
): OrderPricing {
  const subtotal = basePrice + customizationFee + deliveryFee - discount;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    basePrice,
    customizationFee,
    deliveryFee,
    discount,
    tax,
    total,
    currency: "NGN",
  };
}

/**
 * Calculate customization fee based on selected options
 */
export function calculateCustomizationFee(
  selectedOptions: Array<{ optionName: string; selectedValue: string }>,
  availableOptions: CustomizationOption[]
): number {
  let totalFee = 0;

  for (const selected of selectedOptions) {
    const option = availableOptions.find((opt) => opt.name === selected.optionName);
    if (option) {
      totalFee += option.priceImpact;
    }
  }

  return totalFee;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Calculate average
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate worker efficiency
 */
export function calculateWorkerEfficiency(
  completedTasks: number,
  totalAssigned: number,
  averageDuration: number,
  estimatedDuration: number
): number {
  if (totalAssigned === 0) return 0;
  
  const completionRate = completedTasks / totalAssigned;
  const timeEfficiency = estimatedDuration / (averageDuration || estimatedDuration);
  
  return Math.min(Math.round((completionRate * 0.6 + timeEfficiency * 0.4) * 100), 100);
}