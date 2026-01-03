// ============================================
// FILE: src/components/layout/Navbar.tsx
// ============================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Bell,
	Heart,
	Menu,
	Package,
	Search,
	Scissors,
	ShoppingBag,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser as useConvexUser } from "@/hooks/useUser";
import { useState } from "react";

export function Navbar() {
	const pathname = usePathname();
	const { isSignedIn } = useUser();
	const { user } = useConvexUser();
	const { unreadCount } = useNotifications(user?._id);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);

	const navigation = [
		{ name: "Showcase", href: "/styles", current: pathname === "/styles" },
		{ name: "Organizations", href: "/organizations", current: pathname === "/organizations" },
	];

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="container-custom">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 font-display">
						<Scissors className="h-6 w-6" />
						<span className="text-xl font-bold">StyleHub</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"text-sm font-semibold transition-colors hover:text-primary",
									item.current
										? "text-foreground"
										: "text-muted-foreground"
								)}
							>
								{item.name}
							</Link>
						))}
					</div>

					{/* Search Bar (Desktop) */}
					<div className="hidden lg:flex flex-1 max-w-md mx-8">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search styles, organizations..."
								className="pl-10"
							/>
						</div>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						{/* Search Button (Mobile) */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setSearchOpen(!searchOpen)}
						>
							<Search className="h-5 w-5" />
						</Button>

						{isSignedIn ? (
							<>
								{/* Saved Styles */}
								<Link href="/saved">
									<Button variant="ghost" size="icon">
										<Heart className="h-5 w-5" />
									</Button>
								</Link>

								{/* Notifications */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="relative">
											<Bell className="h-5 w-5" />
											{unreadCount > 0 && (
												<Badge
													variant="error"
													className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
												>
													{unreadCount > 9 ? "9+" : unreadCount}
												</Badge>
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-80">
										<DropdownMenuLabel>Notifications</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<div className="max-h-96 overflow-y-auto">
											{/* Notification items will be populated here */}
											<div className="p-4 text-center text-sm text-muted-foreground">
												No new notifications
											</div>
										</div>
									</DropdownMenuContent>
								</DropdownMenu>

								{/* Orders */}
								<Link href="/dashboard/orders">
									<Button variant="ghost" size="icon">
										<Package className="h-5 w-5" />
									</Button>
								</Link>

								{/* User Menu */}
								<UserButton
									appearance={{
										elements: {
											avatarBox: "w-9 h-9",
										},
									}}
									afterSignOutUrl="/"
								/>
							</>
						) : (
							<>
								<SignInButton mode="modal">
									<Button variant="ghost">Sign In</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button>Get Started</Button>
								</SignUpButton>
							</>
						)}

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Search */}
				{searchOpen && (
					<div className="lg:hidden pb-4 pt-2 animate-slide-in-from-top">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search styles, organizations..."
								className="pl-10"
							/>
						</div>
					</div>
				)}

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-border py-4 animate-slide-in-from-top">
						<div className="space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"block px-4 py-3 text-base font-semibold rounded-lg transition-colors",
										item.current
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									)}
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}