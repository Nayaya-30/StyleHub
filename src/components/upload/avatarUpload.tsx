
// ============================================
// FILE: src/components/upload/AvatarUpload.tsx
// ============================================

"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  fallback: string;
  folder?: string;
  className?: string;
}

export function AvatarUpload({
  value,
  onChange,
  fallback,
  folder = "avatars",
  className,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { upload } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const result = await upload(file, folder);
      onChange(result.url);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className="h-32 w-32">
        <AvatarImage src={value} />
        <AvatarFallback className="text-3xl">{fallback}</AvatarFallback>
      </Avatar>

      <label
        htmlFor="avatar-upload"
        className={cn(
          "absolute bottom-0 right-0 cursor-pointer",
          uploading && "pointer-events-none"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-medium hover:bg-primary/90 transition-colors">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}