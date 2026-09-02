"use client";

// src/app/(dashboardLayout)/rider/profile/page.tsx

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getRiderProfile,
  updateRiderProfile,
  type RiderProfile,
} from "@/services/riderDashboardService";

const VEHICLE_TYPES = [
  { value: "bike", label: "Bike" },
  { value: "bicycle", label: "Bicycle" },
  { value: "walk", label: "Walk" },
  { value: "car", label: "Car" },
  { value: "auto", label: "Auto" },
  { value: "pickup", label: "Pickup" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "others", label: "Others" },
];

const VEHICLE_NEEDS_NUMBER = ["bike", "motorcycle", "car", "auto", "pickup"];

export default function RiderProfilePage() {
  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    area: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRiderProfile();
        setRider(data);
        setForm({
          name: data.name,
          phone: data.phone,
          vehicleType: data.vehicleType,
          vehicleNumber: data.vehicleNumber ?? "",
          area: data.area ?? "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(form.phone)) {
      toast.error("Enter a valid Bangladeshi phone number");
      return;
    }
    if (
      VEHICLE_NEEDS_NUMBER.includes(form.vehicleType) &&
      !form.vehicleNumber.trim()
    ) {
      toast.error("Vehicle number is required for this vehicle type");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateRiderProfile({
        name: form.name,
        phone: form.phone,
        vehicleType: form.vehicleType,
        vehicleNumber: form.vehicleNumber || undefined,
        area: form.area || undefined,
      });
      setRider(updated);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!rider) return;
    setForm({
      name: rider.name,
      phone: rider.phone,
      vehicleType: rider.vehicleType,
      vehicleNumber: rider.vehicleNumber ?? "",
      area: rider.area ?? "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 max-w-xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!rider) return null;

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Profile</h1>
        {rider.isApproved && !rider.isSuspended && (
          <Badge className="bg-green-500">Approved</Badge>
        )}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardContent className="pt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold">৳{rider.totalEarnings}</div>
            <div className="text-xs text-gray-500">Total Earnings</div>
          </div>
          <div>
            <div className="text-lg font-bold">{rider.totalDeliveries}</div>
            <div className="text-xs text-gray-500">Deliveries</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {rider.rating > 0 ? `${rider.rating.toFixed(1)} ⭐` : "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {rider.totalReviews} reviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Personal Information</CardTitle>
          {!editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email — always read-only */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Email</Label>
            <Input value={rider.user.email} disabled />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Name</Label>
            <Input
              value={editing ? form.name : rider.name}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Phone</Label>
            <Input
              value={editing ? form.phone : rider.phone}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Vehicle Type</Label>
            {editing ? (
              <Select
                value={form.vehicleType}
                onValueChange={(v) => setForm({ ...form, vehicleType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={
                  VEHICLE_TYPES.find((v) => v.value === rider.vehicleType)
                    ?.label ?? rider.vehicleType
                }
                disabled
              />
            )}
          </div>

          {/* Vehicle Number */}
          {(editing
            ? VEHICLE_NEEDS_NUMBER.includes(form.vehicleType)
            : !!rider.vehicleNumber) && (
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Vehicle Number</Label>
              <Input
                value={editing ? form.vehicleNumber : rider.vehicleNumber ?? ""}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, vehicleNumber: e.target.value })
                }
              />
            </div>
          )}

          {/* Area */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Area</Label>
            <Input
              value={editing ? form.area : rider.area ?? ""}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="e.g. Mirpur"
            />
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}