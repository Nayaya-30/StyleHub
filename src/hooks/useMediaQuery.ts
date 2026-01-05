// ============================================
// FILE: src/hooks/useMediaQuery.ts
// ============================================

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    const handler = () => onStoreChange();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  };
  const getSnapshot = () => {
    return typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  };
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
