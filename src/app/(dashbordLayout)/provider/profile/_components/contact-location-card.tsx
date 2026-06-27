// src/app/(dashbordLayout)/provider/profile/_components/contact-location-card.tsx
"use client";

import { Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactLocationCardProps {
  contactPhone: string;
  contactEmail: string;
  city: string;
  area: string;
  address: string;
  onChange: (key: string, value: any) => void;
}

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{text}</span>
    </div>
  );
}

export function ContactLocationCard({
  contactPhone, contactEmail, city, area, address, onChange,
}: ContactLocationCardProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="p-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <Phone className="h-3.5 w-3.5" style={{ color: "var(--brand-primary)" }} />
          </span>
          Contact & location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Contact */}
        <div>
          <SectionLabel icon={<Phone className="h-3.5 w-3.5" />} text="Contact" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Phone <span style={{ color: "var(--brand-primary)" }}>*</span></Label>
              <Input placeholder="01XXXXXXXXX" value={contactPhone}
                onChange={(e) => onChange("contactPhone", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input type="email" placeholder="restaurant@example.com" value={contactEmail}
                onChange={(e) => onChange("contactEmail", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionLabel icon={<MapPin className="h-3.5 w-3.5" />} text="Location" />
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">City</Label>
              <Input placeholder="Dhaka" value={city}
                onChange={(e) => onChange("city", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Area</Label>
              <Input placeholder="Dhanmondi" value={area}
                onChange={(e) => onChange("area", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Full address</Label>
            <Input placeholder="House #, Road #, Area..." value={address}
              onChange={(e) => onChange("address", e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}