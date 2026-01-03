// ============================================
// FILE: src/components/features/OrganizationCard.tsx
// ============================================

"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Package, CheckCircle, TrendingUp } from "lucide-react";
import { Organization } from "@/types";
import { cn } from "@/lib/utils";

interface OrganizationCardProps {
  organization: Organization;
  className?: string;
}

export function OrganizationCard({ organization, className }: OrganizationCardProps) {
  return (
    <Link href={`/organizations/${organization.slug}`}>
      <Card className={cn("group overflow-hidden hover-scale cursor-pointer", className)}>
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-br from-secondary-100 to-secondary-200">
          {organization.coverImage && (
            <img
              src={organization.coverImage}
              alt={organization.name}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <CardContent className="relative p-6 pt-0">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-medium">
              <AvatarImage src={organization.logo} />
              <AvatarFallback className="text-2xl font-bold bg-secondary text-secondary-foreground">
                {organization.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {organization.verified && (
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-success text-white flex items-center justify-center shadow-soft">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                {organization.name}
              </h3>
              {organization.tagline && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {organization.tagline}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {organization.description}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{organization.address}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
              <div className="text-center">
                <div className="text-lg font-bold">{organization.stats.totalDesigns}</div>
                <div className="text-xs text-muted-foreground">Designs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{organization.stats.completedOrders}</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-lg font-bold">
                    {organization.stats.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {organization.isPremium && (
                <Badge variant="warning" size="sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {organization.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="outline" size="sm">
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Action */}
            <Button className="w-full" size="sm">
              View Designs
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
