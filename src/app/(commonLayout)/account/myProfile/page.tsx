"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { myProfileService, UserProfile } from "@/services/myProfileALLService/myProfile.service";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data?.user) {
          router.push("/login");
          return;
        }

        const userProfile = await myProfileService.getProfile();
        setProfile(userProfile);
      } catch (err: any) {
        console.error(err);
        if (err.message === "UNAUTHORIZED") {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSessionAndProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-full max-w-2xl space-y-6 px-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>
        <ProfileForm user={profile} onUpdate={(updated) => setProfile(updated)} />
      </div>
    </div>
  );
}