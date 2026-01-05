"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, BarChart3, Settings, MessageSquare, Bookmark } from "lucide-react";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const items: Item[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/styles", label: "Styles", icon: Package },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid max-w-6xl grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-3 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

