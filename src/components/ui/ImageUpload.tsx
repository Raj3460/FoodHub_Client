// ✅ ধাপ ২: src/components/ui/ImageUpload.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
// import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  showUrlInput?: boolean;
  className?: string;
  previewClassName?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  disabled = false,
  showUrlInput = true,
  className = "",
  previewClassName = "h-20 w-20 rounded-full object-cover border",
}: ImageUploadProps) {
  const { uploadImage, uploading } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(value || null);
  const [urlInputValue, setUrlInputValue] = useState(value || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const cloudUrl = await uploadImage(file);
    if (cloudUrl) {
      onChange(cloudUrl);
      setPreview(cloudUrl);
      setUrlInputValue(cloudUrl);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInputValue(url);
    setPreview(url || null);
    onChange(url);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      {/* ফাইল ইনপুট */}
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading || disabled}
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}

      {/* অপশনাল ম্যানুয়াল URL */}
      {showUrlInput && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">or paste URL</span>
          <Input
            value={urlInputValue}
            onChange={handleUrlChange}
            placeholder="https://..."
            disabled={uploading || disabled}
          />
        </div>
      )}

      {/* প্রিভিউ */}
      {preview && !uploading && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className={previewClassName} />
        </div>
      )}
    </div>
  );
}