// ============================================
// FILE: src/app/organizations/[slug]/page.tsx
// ============================================

"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StyleCard } from "@/components/features/StyleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationShowcaseSkeleton } from "@/components/loading/OrganizationSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  Package,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
 
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export default function OrganizationShowcasePage({ params }: PageProps) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState("all");

  const organization = useQuery(api.organizations.getOrganizationBySlug, { slug });
  const styles = useQuery(
    api.styles.getStylesByOrganization,
    organization?._id
      ? { organizationId: organization._id, isActive: true }
      : "skip"
  );

  const isLoading = organization === undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <SkeletonWrapper>
            <OrganizationShowcaseSkeleton />
          </SkeletonWrapper>
        </main>
        <Footer />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container-custom py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Organization Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The organization you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/organizations">
              <Button>Browse All Organizations</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredStyles =
    activeTab === "all"
      ? styles
      : styles?.filter((style) => style.gender === activeTab);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-br from-secondary-100 to-secondary-200">
              <Image
                width={100}
                height={100}
                src={organization.coverImage}
                alt={organization.name}
                className="h-full w-full object-cover"
              />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Organization Header */}
        <div className="container-custom">
          <Card className="relative -mt-20 mb-8 p-6 shadow-large">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-background shadow-medium">
                <AvatarImage src={organization.logo} />
                <AvatarFallback className="text-4xl font-bold">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{organization.name}</h1>
                      {organization.verified && (
                        <CheckCircle className="h-6 w-6 text-success" />
                      )}
                    </div>
                    {organization.tagline && (
                      <p className="text-lg text-muted-foreground">{organization.tagline}</p>
                    )}
                  </div>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{organization.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{organization.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{organization.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{organization.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {organization.isPremium && (
                    <Badge variant="warning">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {organization.badges.map((badge) => (
                    <Badge key={badge} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold">{organization.stats.totalDesigns}</div>
                <div className="text-sm text-muted-foreground">Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{organization.stats.completedOrders}</div>
                <div className="text-sm text-muted-foreground">Completed Orders</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-6 w-6 fill-warning text-warning" />
                  <span className="text-3xl font-bold">
                    {organization.stats.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {organization.stats.totalReviews} Reviews
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{organization.stats.responseTime}h</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Designs</TabsTrigger>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="kids">Kids</TabsTrigger>
              <TabsTrigger value="unisex">Unisex</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Styles Grid */}
          <div className="pb-12">
            {filteredStyles && filteredStyles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStyles.map((style) => (
                  <StyleCard key={style._id} style={style} organization={organization} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No designs found</h3>
                <p className="text-muted-foreground mb-8">
                  This organization hasn&apos;t added any designs in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
