"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/upload/ImageUpload";

export default function PortfolioCreatePage() {
  const { user } = useUser();
  const create = useMutation(api.workerPortfolio.addPortfolioItem);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; publicId: string; alt?: string }[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add Portfolio Item</h1>
          <p className="text-muted-foreground">Showcase a completed work</p>
        </div>
        <Card className="p-4 space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <Input value={tags.join(", ")} onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="Tags (comma separated)" />
          <div className="flex items-center gap-3">
            <label className="text-sm">Public</label>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <label className="text-sm">Featured</label>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          </div>
          <ImageUpload value={images} onChange={setImages} folder="portfolio" />
          <Button
            onClick={async () => {
              if (!user?._id) return;
              await create({
                workerId: user._id,
                orderId: undefined,
                title: title.trim(),
                description: description.trim(),
                images,
                category: category.trim(),
                tags,
                isPublic,
                isFeatured,
                completedAt: Date.now(),
              });
            }}
          >
            Save
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}

