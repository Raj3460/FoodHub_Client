"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    restaurantName: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    city: "",
    area: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/my/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/my/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Restaurant Profile</h1>
        <p className="text-muted-foreground">Manage your restaurant information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your restaurant details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Restaurant Name *</Label>
              <Input
                value={profile.restaurantName}
                onChange={(e) => setProfile({ ...profile, restaurantName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Contact Phone *</Label>
              <Input
                value={profile.contactPhone}
                onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={profile.description || ""}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={profile.contactEmail || ""}
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>City</Label>
              <Input
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Area</Label>
              <Input
                value={profile.area || ""}
                onChange={(e) => setProfile({ ...profile, area: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}