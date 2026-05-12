// src/services/providerDashboardService/provider-meals.service.ts
import { env } from "@/env";
import type {
  Meal,
  MealCreatePayload,
  MealUpdatePayload,
  MealFilters,
} from "./types";

// নিজের মিল
export const getMyMeals = async (): Promise<Meal[]> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/meals`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    return [];
  }
};

// পাবলিক মিল (সার্চ/ফিল্টার সহ)
export const getAllMeals = async (filters?: MealFilters): Promise<Meal[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.minRating !== undefined) params.append("minRating", String(filters.minRating));
    if (filters?.sort) params.append("sort", filters.sort);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals${query}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch all meals:", error);
    return [];
  }
};

// একক মিল
export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals/${id}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to fetch meal:", error);
    return null;
  }
};

// তৈরি
export const createMeal = async (payload: MealCreatePayload): Promise<Meal | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) {
      console.warn(`Create meal failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to create meal:", error);
    return null;
  }
};

// আপডেট
export const updateMeal = async (
  id: string,
  payload: MealUpdatePayload
): Promise<Meal | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!res.ok) {
      console.warn(`Update meal failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to update meal:", error);
    return null;
  }
};

// ডিলিট
export const deleteMeal = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("Failed to delete meal:", error);
    return false;
  }
};

// এভেইলেবিলিটি টগল
export const toggleMealAvailability = async (
  id: string,
  isAvailable: boolean
): Promise<Meal | null> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable }),
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to toggle meal availability:", error);
    return null;
  }
};