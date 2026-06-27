// src/app/(dashbordLayout)/provider/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
} from "@/services/providerDashboardService/provider-profile.service";
import type { ProviderProfileUpdatePayload } from "@/services/providerDashboardService/types";

import { ProfileHeader } from "./_components/profile-header";
import { BasicInfoCard } from "./_components/basic-info-card";
import { ContactLocationCard } from "./_components/contact-location-card";
import { OperatingHoursCard } from "./_components/operating-hours-card";
import { DeliverySettingsCard } from "./_components/delivery-settings-card";
import { ImagesCard } from "./_components/images-card";

const defaultProfile: ProviderProfileUpdatePayload = {
  restaurantName: "", branch: "", description: "",
  contactPhone: "", contactEmail: "",
  address: "", city: "", area: "",
  cuisineType: "", isOpen: false,
  openingTime: "", closingTime: "", weeklyOff: "",
  deliveryFee: 0, deliveryTimeMin: 0, deliveryTimeMax: 0,
  minOrderAmount: 0, logo: "", coverImage: "",
};

export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState<ProviderProfileUpdatePayload>(defaultProfile);
  const [meta, setMeta] = useState<{
    isApproved: boolean;
    rating: number;
    totalReviews: number;
    totalOrders?: number;
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
          const totalOrders = (data as { totalOrders?: number }).totalOrders;
          setMeta({
            isApproved: data.isApproved,
            rating: data.rating,
            totalReviews: data.totalReviews,
            totalOrders,
          });
          setProfileExists(true);
        }
      } catch {
        toast.error("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key: string, value: any) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!profile.restaurantName?.trim() || !profile.contactPhone?.trim()) {
      toast.error("Restaurant name and contact phone are required.");
      return;
    }

    const sanitized: any = {
      ...profile,
      restaurantName: profile.restaurantName.trim(),
      contactPhone: profile.contactPhone.trim(),
      cuisineType: profile.cuisineType?.trim() ? [profile.cuisineType.trim()] : [],
      isOpen: Boolean(profile.isOpen),
      deliveryFee: Number(profile.deliveryFee) || 0,
      deliveryTimeMin: Number(profile.deliveryTimeMin) || 0,
      deliveryTimeMax: Number(profile.deliveryTimeMax) || 0,
      minOrderAmount: Number(profile.minOrderAmount) || 0,
    };

    setSaving(true);
    try {
      const result = profileExists
        ? await updateMyProfile(sanitized)
        : await createMyProfile(sanitized);

      if (result) {
        toast.success(profileExists ? "Profile updated!" : "Profile created!");
        setProfileExists(true);
      } else {
        toast.error("Failed to save. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Unexpected error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-56 w-full rounded-2xl" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl pb-8">
      <ProfileHeader
        profileExists={profileExists}
        saving={saving}
        coverImage={profile.coverImage}
        logo={profile.logo}
        restaurantName={profile.restaurantName}
        branch={profile.branch}
        city={profile.city}
        isApproved={meta?.isApproved}
        rating={meta?.rating}
        totalReviews={meta?.totalReviews}
        totalOrders={meta?.totalOrders}
        isOpen={profile.isOpen}
        onSave={handleSave}
      />

      <BasicInfoCard
        restaurantName={profile.restaurantName ?? ""}
        branch={profile.branch ?? ""}
        cuisineType={profile.cuisineType ?? ""}
        description={profile.description ?? ""}
        onChange={set}
      />

      <ContactLocationCard
        contactPhone={profile.contactPhone ?? ""}
        contactEmail={profile.contactEmail ?? ""}
        city={profile.city ?? ""}
        area={profile.area ?? ""}
        address={profile.address ?? ""}
        onChange={set}
      />

      <OperatingHoursCard
        isOpen={profile.isOpen ?? false}
        openingTime={profile.openingTime ?? ""}
        closingTime={profile.closingTime ?? ""}
        weeklyOff={profile.weeklyOff ?? ""}
        onChange={set}
      />

      <DeliverySettingsCard
        deliveryFee={profile.deliveryFee ?? 0}
        deliveryTimeMin={profile.deliveryTimeMin ?? 0}
        deliveryTimeMax={profile.deliveryTimeMax ?? 0}
        minOrderAmount={profile.minOrderAmount ?? 0}
        onChange={set}
      />

      <ImagesCard
        logo={profile.logo ?? ""}
        coverImage={profile.coverImage ?? ""}
        onChange={set}
      />
    </div>
  );
}