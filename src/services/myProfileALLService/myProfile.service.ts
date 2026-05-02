// src/services/myProfileALLService/myProfile.service.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
}


export interface UpdateProfileData {
  name?: string;
  phone?: string;
}

class MyProfileService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${this.baseUrl}/api/user/profile`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // যদি 401/403 আসে, তাহলে সম্ভবত session expired – redirect to login
      if (res.status === 401 || res.status === 403) {
        // আমরা frontend এ এই error ধরব এবং লগইন পেইজে পাঠাব
        throw new Error("UNAUTHORIZED");
      }
      // অন্য error – আমরা plain text পড়ার চেষ্টা করব
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch profile");
    return data.data;
  }

  async updateProfile(data: { name?: string; phone?: string }): Promise<UserProfile> {
    const res = await fetch(`${this.baseUrl}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }
}

export const myProfileService = new MyProfileService();