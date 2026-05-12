// src/app/(dashbordLayout)/provider/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  ImagePlus,
  Save,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";
import {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
} from "@/services/providerDashboardService/provider-profile.service";
import type { ProviderProfileUpdatePayload } from "@/services/providerDashboardService/types";
import ImageUpload from "@/components/ui/ImageUpload";

// ── CuisineType Enum Values ──────────────────────────
const CUISINE_OPTIONS = [
  "Bengali",
  "Chinese",
  "Indian",
  "Thai",
  "Italian",
  "Mexican",
  "Arabic",
  "Continental",
  "FastFood",
  "Desserts",
  "Beverages",
];

// ── Helper Components ───────────────────────────────
function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
        <span className="p-1.5 rounded-lg bg-orange-50 text-orange-500">
          {icon}
        </span>
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-sm">{description}</CardDescription>
      )}
    </CardHeader>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ── Main Component ──────────────────────────────────
export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState<ProviderProfileUpdatePayload>({
    restaurantName: "",
    branch: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    city: "",
    area: "",
    cuisineType: "",
    isOpen: false,
    openingTime: "",
    closingTime: "",
    weeklyOff: "",
    deliveryFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    minOrderAmount: 0,
    logo: "",
    coverImage: "",
  });

  const [meta, setMeta] = useState<{
    isApproved: boolean;
    rating: number;
    totalReviews: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        if (data) {
          setProfile({
            restaurantName: data.restaurantName ?? "",
            branch: data.branch ?? "",
            description: data.description ?? "",
            contactPhone: data.contactPhone ?? "",
            contactEmail: data.contactEmail ?? "",
            address: data.address ?? "",
            city: data.city ?? "",
            area: data.area ?? "",
            // ✅ array থেকে string বের করি
            cuisineType: Array.isArray(data.cuisineType)
              ? (data.cuisineType[0] ?? "")
              : (data.cuisineType ?? ""),
            isOpen: data.isOpen ?? false,
            openingTime: data.openingTime ?? "",
            closingTime: data.closingTime ?? "",
            weeklyOff: data.weeklyOff ?? "",
            deliveryFee: data.deliveryFee ?? 0,
            deliveryTimeMin: data.deliveryTimeMin ?? 0,
            deliveryTimeMax: data.deliveryTimeMax ?? 0,
            minOrderAmount: data.minOrderAmount ?? 0,
            logo: data.logo ?? "",
            coverImage: data.coverImage ?? "",
          });
          setMeta({
            isApproved: data.isApproved,
            rating: data.rating,
            totalReviews: data.totalReviews,
          });
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (err) {
        toast.error("Could not load profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key: keyof ProviderProfileUpdatePayload, value: any) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!profile.restaurantName?.trim() || !profile.contactPhone?.trim()) {
      toast.error("Restaurant name and contact phone are required.");
      return;
    }

    const sanitized: any = {
      restaurantName: profile.restaurantName.trim(),
      branch: profile.branch?.trim() || undefined,
      description: profile.description?.trim() || undefined,
      contactPhone: profile.contactPhone.trim(),
      contactEmail: profile.contactEmail?.trim() || undefined,
      address: profile.address?.trim() || undefined,
      city: profile.city?.trim() || undefined,
      area: profile.area?.trim() || undefined,
      // ✅ STRING → ARRAY তে রূপান্তর
      cuisineType: profile.cuisineType?.trim()
        ? [profile.cuisineType.trim()]
        : [],
      isOpen: Boolean(profile.isOpen),
      openingTime: profile.openingTime?.trim() || undefined,
      closingTime: profile.closingTime?.trim() || undefined,
      weeklyOff: profile.weeklyOff?.trim() || undefined,
      deliveryFee: Number(profile.deliveryFee) || 0,
      deliveryTimeMin: Number(profile.deliveryTimeMin) || 0,
      deliveryTimeMax: Number(profile.deliveryTimeMax) || 0,
      minOrderAmount: Number(profile.minOrderAmount) || 0,
      logo: profile.logo?.trim() || undefined,
      coverImage: profile.coverImage?.trim() || undefined,
    };

    setSaving(true);
    try {
      const result = profileExists
        ? await updateMyProfile(sanitized)
        : await createMyProfile(sanitized);
      if (result) {
        toast.success(
          profileExists ? "Profile updated!" : "Profile created successfully!"
        );
        setProfileExists(true);
      } else {
        toast.error("Failed to save profile. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-1 max-w-3xl">
        <Skeleton className="h-8 w-56" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {profileExists ? "Restaurant Profile" : "Create Restaurant Profile"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profileExists
              ? "Manage your restaurant information"
              : "Fill in the details to set up your restaurant"}
          </p>
        </div>
        {meta && profileExists && (
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                meta.isApproved
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {meta.isApproved ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {meta.isApproved ? "Approved" : "Pending Approval"}
            </span>
            {meta.rating > 0 && (
              <span className="text-xs text-muted-foreground">
                ⭐ {meta.rating.toFixed(1)} ({meta.totalReviews} reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<Store className="h-4 w-4" />}
          title="Basic Information"
          description="Your restaurant's public-facing details"
        />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Restaurant Name" required>
              <Input
                placeholder="e.g. Spice Garden"
                value={profile.restaurantName}
                onChange={(e) => set("restaurantName", e.target.value)}
              />
            </Field>
            <Field label="Branch">
              <Input
                placeholder="e.g. Dhanmondi Branch"
                value={profile.branch}
                onChange={(e) => set("branch", e.target.value)}
              />
            </Field>
          </div>

          {/* Cuisine Type Dropdown */}
          <Field label="Cuisine Type">
            <Select
              value={profile.cuisineType ?? ""}
              onValueChange={(value) => set("cuisineType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                {CUISINE_OPTIONS.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Description">
            <Textarea
              rows={3}
              placeholder="Tell customers about your restaurant..."
              value={profile.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<Phone className="h-4 w-4" />}
          title="Contact Details"
        />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact Phone" required>
              <Input
                placeholder="01XXXXXXXXX"
                value={profile.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
              />
            </Field>
            <Field label="Contact Email">
              <Input
                type="email"
                placeholder="restaurant@example.com"
                value={profile.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<MapPin className="h-4 w-4" />}
          title="Location"
        />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <Input
                placeholder="e.g. Dhaka"
                value={profile.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>
            <Field label="Area">
              <Input
                placeholder="e.g. Dhanmondi"
                value={profile.area}
                onChange={(e) => set("area", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Full Address">
            <Input
              placeholder="House #, Road #, Area..."
              value={profile.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<Clock className="h-4 w-4" />}
          title="Opening Hours"
        />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Currently Open
              </p>
              <p className="text-xs text-muted-foreground">
                Customers can place orders when you're open
              </p>
            </div>
            <Switch
              checked={profile.isOpen}
              onCheckedChange={(v) => set("isOpen", v)}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Opening Time">
              <Input
                type="time"
                value={profile.openingTime}
                onChange={(e) => set("openingTime", e.target.value)}
              />
            </Field>
            <Field label="Closing Time">
              <Input
                type="time"
                value={profile.closingTime}
                onChange={(e) => set("closingTime", e.target.value)}
              />
            </Field>
            <Field label="Weekly Off">
              <Input
                placeholder="e.g. Friday"
                value={profile.weeklyOff}
                onChange={(e) => set("weeklyOff", e.target.value)}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<Truck className="h-4 w-4" />}
          title="Delivery Settings"
        />
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Delivery Fee (৳)">
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={profile.deliveryFee || ""}
                onChange={(e) =>
                  set("deliveryFee", parseFloat(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Min Delivery Time (min)">
              <Input
                type="number"
                min={0}
                placeholder="e.g. 20"
                value={profile.deliveryTimeMin || ""}
                onChange={(e) =>
                  set("deliveryTimeMin", parseInt(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Max Delivery Time (min)">
              <Input
                type="number"
                min={0}
                placeholder="e.g. 45"
                value={profile.deliveryTimeMax || ""}
                onChange={(e) =>
                  set("deliveryTimeMax", parseInt(e.target.value) || 0)
                }
              />
            </Field>
          </div>
          <Field label="Minimum Order Amount (৳)">
            <Input
              type="number"
              min={0}
              placeholder="e.g. 150"
              className="max-w-xs"
              value={profile.minOrderAmount || ""}
              onChange={(e) =>
                set("minOrderAmount", parseFloat(e.target.value) || 0)
              }
            />
          </Field>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader
          icon={<ImagePlus className="h-4 w-4" />}
          title="Images"
          description="Logo & Cover — upload or paste URL"
        />
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Logo
              </Label>
              <ImageUpload
                value={profile.logo || ""}
                onChange={(url) => set("logo", url)}
                previewClassName="h-20 w-20 rounded-full object-cover border"
                showUrlInput={true}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Cover Image
              </Label>
              <ImageUpload
                value={profile.coverImage || ""}
                onChange={(url) => set("coverImage", url)}
                previewClassName="h-20 w-full rounded-xl object-cover border"
                showUrlInput={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save / Create Button */}
      <div className="flex justify-end pb-4">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2 px-8"
        >
          {profileExists ? (
            <Save className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {saving
            ? "Saving..."
            : profileExists
            ? "Save Changes"
            : "Create Profile"}
        </Button>
      </div>
    </div>
  );
}