// ============================================
// FILE: src/hooks/useUser.ts
// ============================================

import { useQuery } from "convex/react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export function useUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser();
  
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  return {
    user: convexUser,
    clerkUser,
    isLoading: !isClerkLoaded || (clerkUser && convexUser === undefined),
    isAuthenticated: !!clerkUser,
  };
}