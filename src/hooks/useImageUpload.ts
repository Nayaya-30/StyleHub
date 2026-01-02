// ============================================
// FILE: src/hooks/useImageUpload.ts
// ============================================

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UploadResult {
	publicId: string;
	url: string;
	width: number;
	height: number;
}

export function useImageUpload() {
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const uploadAction = useAction(api.actions.uploadToCloudinary);

	const upload = async (
		file: File,
		folder: string = "uploads"
	): Promise<UploadResult> => {
		setIsUploading(true);
		setProgress(0);

		try {
			// Convert file to base64
			const base64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					const result = reader.result as string;
					resolve(result);
				};
				reader.onerror = reject;
				reader.onprogress = (event) => {
					if (event.lengthComputable) {
						setProgress((event.loaded / event.total) * 50); // First 50% for reading
					}
				};
				reader.readAsDataURL(file);
			});

			setProgress(50); // Reading complete

			// Upload to Cloudinary
			const result = await uploadAction({
				file: base64,
				folder,
				resourceType: "image",
			});

			setProgress(100);

			return {
				publicId: result.publicId,
				url: result.url,
				width: result.width,
				height: result.height,
			};
		} catch (error) {
			console.error("Upload failed:", error);
			throw error;
		} finally {
			setIsUploading(false);
			setTimeout(() => setProgress(0), 1000);
		}
	};

	return {
		upload,
		isUploading,
		progress,
	};
}