// ============================================
// FILE: src/components/layout/DashboardLayout.tsx
// ============================================

"use client";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const isMobile = useIsMobile();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen flex-col">
			<Navbar />
			<div className="flex flex-1 overflow-hidden">
				{/* Mobile Sidebar Overlay */}
				{isMobile && sidebarOpen && (
					<div
						className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Sidebar */}
				<div
					className={cn(
						"fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0",
						isMobile && !sidebarOpen && "-translate-x-full"
					)}
				>
					<Sidebar />
				</div>

				{/* Main Content */}
				<main className="flex-1 overflow-y-auto bg-background">
					{isMobile && (
						<div className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/95 backdrop-blur p-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="h-5 w-5" />
							</Button>
						</div>
					)}
					<div className="container-custom py-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
