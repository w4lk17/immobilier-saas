// Multi-image dropzone component for multiple image uploads
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "./ImageDropzone";

interface MultiImageDropzoneProps {
	value?: string[];
	onChange: (images: string[]) => void;
	disabled?: boolean;
	maxFiles?: number;
	accept?: { [mime: string]: string[] };
}

export function MultiImageDropzone({
	value = [],
	onChange,
	disabled,
	maxFiles = 5,
	accept,
}: MultiImageDropzoneProps) {
	const handleAddImage = (imageUrl: string | null) => {
		if (imageUrl && value.length < maxFiles) {
			onChange([...value, imageUrl]);
		}
	};

	const handleRemoveImage = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-4">
			{/* Add new image */}
			{value.length < maxFiles && (
				<ImageDropzone
					value={null}
					onChange={handleAddImage}
					disabled={disabled}
					accept={accept}
				/>
			)}

			{/* Preview existing images */}
			{value.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{value.map((imageUrl, index) => (
						<div
							key={index}
							className="relative group rounded-lg overflow-hidden border"
						>
							<img
								src={imageUrl}
								alt={`Image ${index + 1}`}
								className="w-full h-32 object-cover"
							/>
							{!disabled && (
								<Button
									type="button"
									variant="destructive"
									size="icon"
									className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => handleRemoveImage(index)}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
				</div>
			)}

			{/* File count indicator */}
			<p className="text-xs text-muted-foreground">
				{value.length}/{maxFiles} image{value.length !== 1 ? "s" : ""} ajoutée
				{value.length !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
