// ============================================
// FILE: src/app/styles/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StyleCard } from "@/components/features/StyleCard";
import { SearchFilter } from "@/components/forms/SearchFilter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StyleGridSkeleton } from "@/components/loading/StyleCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Scissors } from "lucide-react";
import { StyleFilters } from "@/types";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";

export default function StylesPage() {
  const [filters, setFilters] = useState<StyleFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "price-low" | "price-high">("newest");

  const styles = useQuery(
    api.styles.getActiveStyles,
    searchQuery
      ? "skip"
      : {
          ...filters,
          sortBy,
          limit: 50,
        }
  );

  const searchResults = useQuery(
    api.styles.searchStyles,
    searchQuery.length >= 2
      ? {
          searchTerm: searchQuery,
          category: filters.category,
          gender: filters.gender as "men" | "women" | "kids" | "unisex" | undefined,
        }
      : "skip"
  );

  const displayStyles = searchQuery.length >= 2 ? searchResults : styles;
  const isLoading = displayStyles === undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Discover Amazing Styles</h1>
            <p className="text-muted-foreground">
              Browse thousands of designs from top tailors across Africa
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <SearchFilter
              onFilterChange={setFilters}
              onSearch={setSearchQuery}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${displayStyles?.length || 0} styles found`}
            </p>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {isLoading ? (
            <SkeletonWrapper>
              <StyleGridSkeleton count={9} />
            </SkeletonWrapper>
          ) : displayStyles && displayStyles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayStyles.map((style) => (
                <StyleCard key={style._id} style={style} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Scissors}
              title="No styles found"
              description="Try adjusting your filters or search query"
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setFilters({});
                  setSearchQuery("");
                },
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}