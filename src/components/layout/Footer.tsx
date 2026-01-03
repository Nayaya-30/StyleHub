// ============================================
// FILE: src/components/layout/Footer.tsx
// ============================================

import Link from "next/link";
import { Scissors, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: "Features", href: "/features" },
			{ name: "Pricing", href: "/pricing" },
			{ name: "FAQ", href: "/faq" },
		],
		company: [
			{ name: "About", href: "/about" },
			{ name: "Blog", href: "/blog" },
			{ name: "Careers", href: "/careers" },
			{ name: "Contact", href: "/contact" },
		],
		resources: [
			{ name: "Documentation", href: "/docs" },
			{ name: "Help Center", href: "/help" },
			{ name: "Community", href: "/community" },
		],
		legal: [
			{ name: "Privacy", href: "/privacy" },
			{ name: "Terms", href: "/terms" },
			{ name: "Cookie Policy", href: "/cookies" },
		],
	};

	const socialLinks = [
		{ name: "Facebook", icon: Facebook, href: "#" },
		{ name: "Twitter", icon: Twitter, href: "#" },
		{ name: "Instagram", icon: Instagram, href: "#" },
		{ name: "LinkedIn", icon: Linkedin, href: "#" },
	];

	return (
		<footer className="border-t border-border bg-card">
			<div className="container-custom py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-2 font-display mb-4">
							<Scissors className="h-6 w-6" />
							<span className="text-xl font-bold">StyleHub</span>
						</Link>
						<p className="text-sm text-muted-foreground mb-4">
							Professional tailoring management platform connecting customers
							with skilled artisans across Africa.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((social) => (
								<Link
									key={social.name}
									href={social.href}
									className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<social.icon className="h-4 w-4" />
									<span className="sr-only">{social.name}</span>
								</Link>
							))}
						</div>
					</div>

					{/* Links */}
					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Resources</h3>
						<ul className="space-y-3">
							{footerLinks.resources.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Legal</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						© {currentYear} StyleHub. All rights reserved.
					</p>
					<p className="text-sm text-muted-foreground">
						Made with ❤️ for African Fashion
					</p>
				</div>
			</div>
		</footer>
	);
}