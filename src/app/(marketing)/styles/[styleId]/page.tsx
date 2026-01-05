// ============================================
// FILE: src/app/styles/[styleId]/page.tsx
// ============================================

"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleDetailSkeleton } from "@/components/loading/StyleDetailSkeleton";
import { SkeletonWrapper } from "@/components/ui/skeleton-loader";
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Eye,
  ShoppingBag,
  MessageSquare,
  Phone,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ styleId: string }>;
}

export default function StyleDetailPage({ params }: PageProps) {
  const { styleId } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);

  const style = useQuery(api.styles.getStyleById, {
    styleId: styleId as Id<"styles">,
  });

  const organization = useQuery(
    api.organizations.getOrganizationById,
    style?.organizationId
      ? { organizationId: style.organizationId }
      : "skip"
  );

  const incrementViews = useMutation(api.styles.incrementStyleViews);

  const isLoading = style === undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <SkeletonWrapper>
            <StyleDetailSkeleton />
          </SkeletonWrapper>
        </main>
        <Footer />
      </div>
    );
  }

  if (!style) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container-custom py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Style Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The style you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/styles">
              <Button>Browse All Styles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                {style.images[selectedImage] ? (
                  <Image
                    src={style.images[selectedImage].url}
                    alt={style.images[selectedImage].alt || style.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {style.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {style.images.map((image, index) => (
                    <button
                      key={image.publicId}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `${style.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{style.title}</h1>
                    {organization && (
                      <Link
                        href={`/organizations/${organization.slug}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={organization.logo} />
                          <AvatarFallback>
                            {organization.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{organization.name}</span>
                      </Link>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">
                    {formatCurrency(style.basePrice, style.currency)}
                  </div>
                  {style.isNegotiable && (
                    <Badge variant="info">Negotiable</Badge>
                  )}
                </div>

                <p className="text-muted-foreground">{style.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{style.stats.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{style.stats.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{style.stats.orders} orders</span>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{style.category}</Badge>
                <Badge variant="outline">{style.gender}</Badge>
                {style.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-4">
                <Link href={`/orders/create?styleId=${style._id}`} className="flex-1">
                  <Button size="lg" className="w-full">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Order Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat
                </Button>
              </div>

              {/* Organization Info */}
              {organization && (
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={organization.logo} />
                      <AvatarFallback className="text-2xl">
                        {organization.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{organization.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{organization.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{organization.stats.totalDesigns}</div>
                      <div className="text-xs text-muted-foreground">Designs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{organization.stats.completedOrders}</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-warning text-warning" />
                        <span className="text-2xl font-bold">
                          {organization.stats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <Link href={`/organizations/${organization.slug}`}>
                    <Button variant="outline" className="w-full">
                      View All Designs
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
