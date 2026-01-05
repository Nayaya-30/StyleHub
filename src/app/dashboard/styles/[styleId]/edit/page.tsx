"use client";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StyleForm } from "@/components/forms/StyleForm";
import type { Id } from "@/convex/_generated/dataModel";

export default function EditStylePage() {
  const params = useParams<{ styleId: string }>();
  const styleId = params.styleId as unknown as Id<"styles">;
  const style = useQuery(api.styles.getStyleById, { styleId });
  const update = useMutation(api.styles.updateStyle);

  if (style === undefined) return null;
  if (!style) return (
    <DashboardLayout>
      <p className="text-muted-foreground">Style not found</p>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Style</h1>
          <p className="text-muted-foreground">Update details for this design</p>
        </div>
        <StyleForm
          initial={{
            title: style.title,
            description: style.description,
            category: style.category,
            subCategory: style.subCategory,
            gender: style.gender,
            images: style.images,
            basePrice: style.basePrice,
            currency: style.currency,
            isNegotiable: style.isNegotiable,
            tags: style.tags,
            measurements: style.measurements,
          }}
          onSubmit={async (data) => {
            await update({
              styleId: style._id,
              title: data.title,
              description: data.description,
              category: data.category,
              subCategory: data.subCategory,
              gender: data.gender,
              basePrice: data.basePrice,
              isNegotiable: data.isNegotiable,
              tags: data.tags,
              isActive: true,
            });
          }}
        />
      </div>
    </DashboardLayout>
  );
}
