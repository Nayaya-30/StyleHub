// ============================================
// FILE: src/components/providers/index.tsx
// ============================================

"use client";

import { ReactNode } from "react";
import { ConvexClerkProvider } from "./ConvexClerkProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexClerkProvider>
      <ThemeProvider>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </ConvexClerkProvider>
  );
}