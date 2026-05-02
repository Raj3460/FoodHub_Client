// services/meals.service.ts
import { env } from "@/env";
import { Meal, MealDetails } from "@/types";

export const mealsService = {
  /**
   * Fetch popular meals (most ordered)
   * @param limit - সংখ্যা নির্ধারণ (ডিফল্ট 6)
   * @returns Promise<Meal[]>
   */
  fetchPopularMeals: async (limit: number = 6): Promise<Meal[]> => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/meals?sort=popular&limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch meals`);
      }

      const data = await res.json();
      let meals: Meal[] = data.data || data;

      // যদি ব্যাকএন্ড sorting না করে, তাহলে ক্লায়েন্ট সাইডে totalOrders অনুযায়ী সাজাই
      if (Array.isArray(meals) && meals.length && !meals[0]?.totalOrders) {
        console.warn("Backend did not sort by totalOrders; sorting client-side.");
        meals.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
      }

      return meals.slice(0, limit);
    } catch (error) {
      console.error("Error fetching popular meals:", error);
      return [];
    }
  },

  /**
   *TODO: Fetch all meals with filters (for Meals Page) :is done
   */
  fetchAllMeals: async (filters: {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
      if (filters.minRating) params.append("minRating", filters.minRating.toString());
      if (filters.sort) params.append("sort", filters.sort);

      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch meals");
      const data = await res.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching meals:", error);
      return [];
    }
  },

  /**
   *TODO: Fetch single meal by ID (for Meal Details Page) : is done
   */
  fetchMealById: async (id: string): Promise<MealDetails | null> => {
    if (!id) {
      return null;
    }

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/meals/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data.data || data || null;
    } catch (error) {
      console.error("Error fetching meal by id:", error);
      return null;
    }
  },
};