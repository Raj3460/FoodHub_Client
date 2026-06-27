// src/app/(dashbordLayout)/provider/profile/_components/delivery-settings-card.tsx
"use client";

import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliverySettingsCardProps {
  deliveryFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  minOrderAmount: number;
  onChange: (key: string, value: any) => void;
}

export function DeliverySettingsCard({
  deliveryFee, deliveryTimeMin, deliveryTimeMax, minOrderAmount, onChange,
}: DeliverySettingsCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="p-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <Truck className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </span>
          Delivery settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Delivery fee (৳)</Label>
            <Input type="number" min={0} placeholder="0"
              value={deliveryFee || ""}
              onChange={(e) => onChange("deliveryFee", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Min time (min)</Label>
            <Input type="number" min={0} placeholder="20"
              value={deliveryTimeMin || ""}
              onChange={(e) => onChange("deliveryTimeMin", parseInt(e.target.value) || 0)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Max time (min)</Label>
            <Input type="number" min={0} placeholder="45"
              value={deliveryTimeMax || ""}
              onChange={(e) => onChange("deliveryTimeMax", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="grid gap-1.5 max-w-xs">
          <Label className="text-xs font-medium text-muted-foreground">Minimum order amount (৳)</Label>
          <Input type="number" min={0} placeholder="150"
            value={minOrderAmount || ""}
            onChange={(e) => onChange("minOrderAmount", parseFloat(e.target.value) || 0)} />
        </div>
      </CardContent>
    </Card>
  );
}