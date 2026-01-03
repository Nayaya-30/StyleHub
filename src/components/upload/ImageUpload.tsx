// ============================================
// FILE: src/components/upload/ImageUpload.tsx
// ============================================

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import { StyleImage } from "@/types";

interface ImageUploadProps {
  value: StyleImage[];
  onChange: (images: StyleImage[]) => void;
  maxFiles?: number;
  folder?: string;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  folder = "styles",
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { upload, progress } = useImageUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }

      setUploading(true);

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const result = await upload(file, folder);
          return {
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            alt: file.name,
          };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        onChange([...value, ...uploadedImages]);
        toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload images. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxFiles, folder, upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles,
    disabled: uploading || value.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-primary",
          isDragActive && "border-primary bg-primary/5",
          (uploading || value.length >= maxFiles) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="p-12 flex flex-col items-center justify-center text-center">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium mb-2">Uploading images...</p>
              <Progress value={progress} className="w-full max-w-xs" />
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-semibold mb-1">
                {isDragActive ? "Drop images here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PNG, JPG, WEBP up to 10MB (Max {maxFiles} files)
              </p>
              <Button type="button" variant="outline" size="sm" disabled={value.length >= maxFiles}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <Card key={image.publicId} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    Primary
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {value.length} / {maxFiles} images uploaded
          {value.length > 0 && " • First image will be used as primary"}
        </p>
      )}
    </div>
  );
}
