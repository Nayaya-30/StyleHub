// ============================================
// FILE: src/components/layout/Sidebar.tsx
// ============================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	LayoutDashboard,
	Package,
	Scissors,
	Users,
	MessageSquare,
	Settings,
	BarChart3,
	Heart,
	Briefcase,
	UserCog,
	Building2,
	LogOut,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/lib/generators";

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();
	const { user, clerkUser } = useUser();

	const getNavigationItems = () => {
		if (!user) return [];

		const role = user.role;

		// Customer Navigation
		if (role === "customer") {
			return [
				{
					name: "Dashboard",
					href: "/dashboard",
					icon: LayoutDashboard,
				},
				{
					name: "My Orders",
					href: "/dashboard/orders",
					icon: Package,
				},
				{
					name: "Saved Styles",
					href: "/saved",
					icon: Heart,
				},
				{
					name: "Messages",
					href: "/messages",
					icon: MessageSquare,
				},
				{
					name: "Settings",
					href: "/settings",
					icon: Settings,
				},
			];
		}

		// Worker Navigation
		if (role === "worker") {
			return [
				{
					name: "Dashboard",
					href: "/dashboard",
					icon: LayoutDashboard,
				},
				{
					name: "My Tasks",
					href: "/dashboard/tasks",
					icon: Briefcase,
				},
				{
					name: "Portfolio",
					href: "/dashboard/portfolio",
					icon: Scissors,
				},
				{
					name: "Messages",
					href: "/messages",
					icon: MessageSquare,
				},
				{
					name: "Settings",
					href: "/settings",
					icon: Settings,
				},
			];
		}

		// Manager Navigation
		if (role === "manager") {
			return [
				{
					name: "Dashboard",
					href: "/dashboard",
					icon: LayoutDashboard,
				},
				{
					name: "Orders",
					href: "/dashboard/orders",
					icon: Package,
				},
				{
					name: "Workers",
					href: "/dashboard/workers",
					icon: Users,
				},
				{
					name: "Messages",
					href: "/messages",
					icon: MessageSquare,
				},
				{
					name: "Analytics",
					href: "/dashboard/analytics",
					icon: BarChart3,
				},
				{
					name: "Settings",
					href: "/settings",
					icon: Settings,
				},
			];
		}

		// Admin Navigation
		if (role === "org_admin" || role === "super_admin") {
			return [
				{
					name: "Dashboard",
					href: "/dashboard",
					icon: LayoutDashboard,
				},
				{
					name: "Orders",
					href: "/dashboard/orders",
					icon: Package,
				},
				{
					name: "Styles",
					href: "/dashboard/styles",
					icon: Scissors,
				},
				{
					name: "Team",
					href: "/dashboard/team",
					icon: Users,
				},
				{
					name: "Customers",
					href: "/dashboard/customers",
					icon: UserCog,
				},
				{
					name: "Messages",
					href: "/messages",
					icon: MessageSquare,
				},
				{
					name: "Analytics",
					href: "/dashboard/analytics",
					icon: BarChart3,
				},
				{
					name: "Organization",
					href: "/dashboard/organization",
					icon: Building2,
				},
				{
					name: "Settings",
					href: "/settings",
					icon: Settings,
				},
			];
		}

		return [];
	};

	const navigationItems = getNavigationItems();

	return (
		<aside
			className={cn(
				"flex h-full w-64 flex-col border-r border-border bg-card",
				className
			)}
		>
			{/* User Info */}
			<div className="p-6">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12">
						<AvatarImage src={clerkUser?.imageUrl} />
						<AvatarFallback>
							{clerkUser?.firstName
								? getInitials(`${clerkUser.firstName} ${clerkUser.lastName || ""}`)
								: "U"}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold truncate">
							{clerkUser?.firstName} {clerkUser?.lastName}
						</p>
						<p className="text-xs text-muted-foreground capitalize">
							{user?.role.replace("_", " ")}
						</p>
					</div>
				</div>
			</div>

			<Separator />

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-4 overflow-y-auto">
				{navigationItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link key={item.name} href={item.href}>
							<Button
								variant={isActive ? "secondary" : "ghost"}
								className={cn(
									"w-full justify-start gap-3",
									isActive && "bg-secondary/80"
								)}
							>
								<item.icon className="h-5 w-5" />
								<span>{item.name}</span>
							</Button>
						</Link>
					);
				})}
			</nav>

			<Separator />

			{/* Footer */}
			<div className="p-4">
				<Button variant="ghost" className="w-full justify-start gap-3">
					<LogOut className="h-5 w-5" />
					<span>Sign Out</span>
				</Button>
			</div>
		</aside>
	);
}