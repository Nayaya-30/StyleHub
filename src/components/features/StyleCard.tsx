// ============================================
// FILE: src/components/features/StyleCard.tsx
// ============================================

"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Style, Organization } from "@/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";

interface StyleCardProps {
	style: Style;
	organization?: Organization;
	isSaved?: boolean;
	className?: string;
}

export function StyleCard({ style, organization, isSaved = false, className }: StyleCardProps) {
	const [saved, setSaved] = useState(isSaved);
	const [isLoading, setIsLoading] = useState(false);

	const saveStyle = useMutation(api.savedStyles.saveStyle);
	const unsaveStyle = useMutation(api.savedStyles.unsaveStyle);
	const incrementViews = useMutation(api.styles.incrementStyleViews);

	const handleSave = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);
		try {
			if (saved) {
				await unsaveStyle({ userId: style.createdBy, styleId: style._id });
				setSaved(false);
				toast.success("Removed from saved styles");
			} else {
				await saveStyle({ userId: style.createdBy, styleId: style._id });
				setSaved(true);
				toast.success("Style saved successfully");
			}
		} catch (error) {
			toast.error("Failed to update saved status");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClick = async () => {
		await incrementViews({ styleId: style._id });
	};

	return (
		<Link href={`/styles/${style._id}`} onClick={handleClick}>
			<Card className={cn("group overflow-hidden hover-scale cursor-pointer", className)}>
				{/* Image */}
				<div className="relative aspect-[3/4] overflow-hidden bg-muted">
					{style.images[0] ? (
						<Image
							src={style.images[0].url}
							alt={style.images[0].alt || style.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="flex h-full items-center justify-center">
							<ShoppingBag className="h-16 w-16 text-muted-foreground" />
						</div>
					)}

					{/* Overlay Actions */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
							<Button
								size="sm"
								className="bg-white text-primary hover:bg-white/90"
							>
								<ShoppingBag className="mr-2 h-4 w-4" />
								Order Now
							</Button>
							<Button
								size="icon"
								variant={saved ? "default" : "secondary"}
								className={cn(
									"rounded-full",
									saved && "bg-error text-white hover:bg-error/90"
								)}
								onClick={handleSave}
								disabled={isLoading}
							>
								<Heart className={cn("h-4 w-4", saved && "fill-current")} />
							</Button>
						</div>
					</div>

					{/* Badges */}
					<div className="absolute top-4 left-4 flex flex-col gap-2">
						{style.isFeatured && (
							<Badge variant="warning" className="shadow-soft">
								Featured
							</Badge>
						)}
						{style.isNegotiable && (
							<Badge variant="info" className="shadow-soft">
								Negotiable
							</Badge>
						)}
					</div>
				</div>

				{/* Content */}
				<CardContent className="p-4 space-y-3">
					<div>
						<h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
							{style.title}
						</h3>
						<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
							{style.description}
						</p>
					</div>

					{/* Organization */}
					{organization && (
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarImage src={organization.logo} />
								<AvatarFallback className="text-xs">
									{organization.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm text-muted-foreground truncate">
								{organization.name}
							</span>
						</div>
					)}

					{/* Price & Stats */}
					<div className="flex items-center justify-between">
						<div>
							<div className="text-xl font-bold">
								{formatCurrency(style.basePrice, style.currency)}
							</div>
							{style.isNegotiable && (
								<div className="text-xs text-muted-foreground">Starting from</div>
							)}
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								<span>{style.stats.views}</span>
							</div>
							<div className="flex items-center gap-1">
								<Heart className="h-4 w-4" />
								<span>{style.stats.likes}</span>
							</div>
						</div>
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-1">
						{style.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" size="sm">
								{tag}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}