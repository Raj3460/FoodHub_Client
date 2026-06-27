import { env } from "@/env";
import type { ProviderProfile, ProviderProfileUpdatePayload } from "./types";

// GET — প্রোফাইল আছে কিনা দেখবে
export const getMyProfile = async (): Promise<ProviderProfile | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/my/profile`, {
      credentials: "include",
    });
    if (res.status === 404) return null; // প্রোফাইল নেই
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

// POST — নতুন প্রোভাইডার প্রোফাইল তৈরি
export const createMyProfile = async (
  payload: ProviderProfileUpdatePayload
): Promise<ProviderProfile | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to create profile:", error);
    return null;
  }
};

//Put — প্রোভাইডার প্রোফাইল আপডেট
export const updateMyProfile = async (
  payload: ProviderProfileUpdatePayload
): Promise<ProviderProfile | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/my/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ ব্যাকএন্ড থেকে আসল ত্রুটি ক্যাপচার করো
      const backendError = data?.error ?? data?.message ?? "Update failed";
      console.error("Backend error:", backendError);
      throw new Error(backendError);
    }

    return data.success ? data.data : null;
  } catch (error) {
    // নেটওয়ার্ক ত্রুটি বা অন্য কিছু
    console.error("Network/Server error:", error);
    throw error; // handleSubmit-এর catch ব্লক পাবে
  }
};