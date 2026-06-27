// src/app/(dashbordLayout)/provider/profile/_components/operating-hours-card.tsx
"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OperatingHoursCardProps {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  weeklyOff: string;
  onChange: (key: string, value: any) => void;
}

export function OperatingHoursCard({
  isOpen, openingTime, closingTime, weeklyOff, onChange,
}: OperatingHoursCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="p-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <Clock className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </span>
          Operating hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Open toggle */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Currently open</p>
            <p className="text-xs text-muted-foreground mt-0.5">Customers can place orders now</p>
          </div>
          <Switch
            checked={isOpen}
            onCheckedChange={(v) => onChange("isOpen", v)}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>

        {/* Times */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Opening time</Label>
            <Input type="time" value={openingTime}
              onChange={(e) => onChange("openingTime", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Closing time</Label>
            <Input type="time" value={closingTime}
              onChange={(e) => onChange("closingTime", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Weekly off</Label>
            <Input placeholder="e.g. Friday" value={weeklyOff}
              onChange={(e) => onChange("weeklyOff", e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}