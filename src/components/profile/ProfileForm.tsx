"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Mail, Phone } from "lucide-react";
import { myProfileService, UserProfile, UpdateProfileData } from "@/services/myProfileALLService/myProfile.service";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh phone number (e.g., 017xxxxxxxx)")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(user.image || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || "",
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const updateData: UpdateProfileData = {
        name: data.name,
        phone: data.phone || undefined,
      };
      const updated = await myProfileService.updateProfile(updateData);
      toast.success("Profile updated successfully");
      onUpdate(updated);
      // Refresh avatar if image changed (though image not updated here)
      if (updated.image) setAvatarSrc(updated.image);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        {/* Left Column – Avatar & User Info */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 ring-4 ring-orange-500/20">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback className="bg-orange-100 text-orange-700 text-3xl font-semibold dark:bg-orange-900/30 dark:text-orange-300">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="capitalize font-semibold">{user.role.toLowerCase()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Member since</p>
            <p className="text-sm">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* Right Column – Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              Update your name and contact details. Your email address cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email (read‑only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <Separator />

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your full name"
                  className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="017xxxxxxxx"
                  className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Optional, but recommended for faster delivery.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Saving</span>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}