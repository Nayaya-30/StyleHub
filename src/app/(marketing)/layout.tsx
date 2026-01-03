// ============================================
// FILE: src/app/layout.tsx
// ============================================

import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

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
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}