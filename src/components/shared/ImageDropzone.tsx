// Reusable image dropzone with preview (data URL)
"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageDropzoneProps = {
  value?: string | null;
  onChange: (val: string | null) => void;
  disabled?: boolean;
  maxSize?: number; // bytes
  accept?: { [mime: string]: string[] };
  className?: string;
};

export function ImageDropzone({
  value,
  onChange,
  disabled,
  maxSize = 1_000_000,
  accept = { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  className,
}: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-50 w-50 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-dashed border-muted-foreground p-4 text-center",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {preview ? (
        <img
          src={preview}
          alt="Prévisualisation"
          className="max-h-48 rounded-lg object-cover"
        />
      ) : (
        <>
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Cliquez ou glissez-déposez une image (PNG, JPG, JPEG, max 1 Mo)
          </p>
        </>
      )}
      <input {...getInputProps()} />
      {isDragActive && (
        <p className="text-xs text-muted-foreground">Déposez l’image…</p>
      )}
    </div>
  );
}