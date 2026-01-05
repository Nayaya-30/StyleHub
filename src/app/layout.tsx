// ============================================
// FILE: src/app/layout.tsx
// ============================================

import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "@/globals.css";

export const metadata: Metadata = {
  title: "StyleHub - Professional Tailoring Management Platform",
  description: "Manage your tailoring business with ease. Connect customers, track orders, and streamline production.",
  keywords: ["tailoring", "fashion", "management", "orders", "custom clothing"],
  authors: [{ name: "StyleHub" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "StyleHub - Professional Tailoring Management Platform",
    description: "Manage your tailoring business with ease.",
    siteName: "StyleHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleHub - Professional Tailoring Management Platform",
    description: "Manage your tailoring business with ease.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}