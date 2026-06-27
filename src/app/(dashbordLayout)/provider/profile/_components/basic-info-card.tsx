// src/app/(dashbordLayout)/provider/profile/_components/basic-info-card.tsx
"use client";

import { Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CUISINE_OPTIONS = [
  "Bengali","Chinese","Indian","Thai","Italian",
  "Mexican","Arabic","Continental","FastFood","Desserts","Beverages",
];

interface BasicInfoCardProps {
  restaurantName: string;
  branch: string;
  cuisineType: string;
  description: string;
  onChange: (key: string, value: any) => void;
}

export function BasicInfoCard({
  restaurantName, branch, cuisineType, description, onChange,
}: BasicInfoCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="p-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <Store className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </span>
          Basic information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Restaurant name <span style={{ color: "var(--brand-primary)" }}>*</span></Label>
            <Input placeholder="Spice Garden" value={restaurantName}
              onChange={(e) => onChange("restaurantName", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Branch</Label>
            <Input placeholder="Dhanmondi Branch" value={branch}
              onChange={(e) => onChange("branch", e.target.value)} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Cuisine type</Label>
          <Select value={cuisineType} onValueChange={(v) => onChange("cuisineType", v)}>
            <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
            <SelectContent>
              {CUISINE_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Description</Label>
          <Textarea rows={3} placeholder="Tell customers about your restaurant..."
            value={description} onChange={(e) => onChange("description", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}