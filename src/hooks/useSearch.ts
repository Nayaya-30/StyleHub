// ============================================
// FILE: src/hooks/useSearch.ts
// ============================================

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "./useDebounce";

export function useSearchStyles(
  initialQuery: string = "",
  category?: string,
  gender?: string
) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const results = useQuery(
    api.styles.searchStyles,
    debouncedQuery.length >= 2
      ? { searchTerm: debouncedQuery, category, gender }
      : "skip"
  );

  return {
    searchQuery,
    setSearchQuery,
    results: results || [],
    isSearching: debouncedQuery !== searchQuery,
  };
}