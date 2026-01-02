
// ============================================
// FILE: src/lib/filters.ts
// ============================================

import type { Style, Order } from "@/types";

/**
 * Filter styles by criteria
 */
export function filterStyles(
  styles: Style[],
  filters: {
    category?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }
): Style[] {
  return styles.filter((style) => {
    if (filters.category && style.category !== filters.category) return false;
    if (filters.gender && style.gender !== filters.gender) return false;
    if (filters.minPrice && style.basePrice < filters.minPrice) return false;
    if (filters.maxPrice && style.basePrice > filters.maxPrice) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = style.title.toLowerCase().includes(searchLower);
      const descMatch = style.description.toLowerCase().includes(searchLower);
      const tagMatch = style.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      if (!titleMatch && !descMatch && !tagMatch) return false;
    }
    return true;
  });
}

/**
 * Sort styles
 */
export function sortStyles(
  styles: Style[],
  sortBy: "newest" | "popular" | "price-low" | "price-high"
): Style[] {
  const sorted = [...styles];

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    case "popular":
      return sorted.sort((a, b) => b.stats.orders - a.stats.orders);
    case "price-low":
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case "price-high":
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    default:
      return sorted;
  }
}