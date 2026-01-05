// ============================================
// FILE: src/app/organizations/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrganizationCard } from "@/components/features/OrganizationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Filter, Building2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "rating">("popular");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const organizations = useQuery(
    api.organizations.getActiveOrganizations,
    debouncedSearch.length >= 2 ? "skip" : { limit: 50 }
  );

  const searchResults = useQuery(
    api.organizations.searchOrganizations,
    debouncedSearch.length >= 2
      ? { searchTerm: debouncedSearch }
      : "skip"
  );

  const displayOrganizations = debouncedSearch.length >= 2 ? searchResults : organizations;
  const isLoading = displayOrganizations === undefined;

  const sortedOrganizations = displayOrganizations
    ? [...displayOrganizations].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return b.createdAt - a.createdAt;
          case "popular":
            return b.stats.completedOrders - a.stats.completedOrders;
          case "rating":
            return b.stats.averageRating - a.stats.averageRating;
          default:
            return 0;
        }
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Discover Tailors</h1>
            <p className="text-muted-foreground">
              Connect with talented tailoring houses across Africa
            </p>
          </div>

          {/* Search and Sort */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${sortedOrganizations.length} organizations found`}
            </p>
          </div>

          {/* Grid */}
          {isLoading ? (
            <SkeletonWrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </SkeletonWrapper>
          ) : sortedOrganizations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOrganizations.map((organization) => (
                <OrganizationCard key={organization._id} organization={organization} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="No organizations found"
              description="Try adjusting your search query"
              action={{
                label: "Clear Search",
                onClick: () => setSearchQuery(""),
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}