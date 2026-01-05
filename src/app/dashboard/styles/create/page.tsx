"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StyleForm } from "@/components/forms/StyleForm";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CreateStylePage() {
  const { user } = useUser();
  const create = useMutation(api.styles.createStyle);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Style</h1>
          <p className="text-muted-foreground">Add a new design to your catalog</p>
        </div>
        {user?.organizationId && (
          <StyleForm
            onSubmit={async (data) => {
              await create({
                organizationId: user.organizationId,
                title: data.title,
                description: data.description,
                category: data.category,
                subCategory: data.subCategory,
                gender: data.gender,
                images: data.images,
                basePrice: data.basePrice,
                currency: data.currency,
                isNegotiable: data.isNegotiable,
                tags: data.tags,
                measurements: data.measurements,
                createdBy: user._id,
              });
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

