// src/app/(dashbordLayout)/provider/profile/_components/images-card.tsx
"use client";

import { ImagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/ImageUpload";

interface ImagesCardProps {
  logo: string;
  coverImage: string;
  onChange: (key: string, value: any) => void;
}

export function ImagesCard({ logo, coverImage, onChange }: ImagesCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="p-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <ImagePlus className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </span>
          Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Logo</Label>
            <ImageUpload
              value={logo}
              onChange={(url) => onChange("logo", url)}
              previewClassName="h-20 w-20 rounded-full object-cover border"
              showUrlInput={true}
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">Cover image</Label>
            <ImageUpload
              value={coverImage}
              onChange={(url) => onChange("coverImage", url)}
              previewClassName="h-20 w-full rounded-xl object-cover border"
              showUrlInput={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}