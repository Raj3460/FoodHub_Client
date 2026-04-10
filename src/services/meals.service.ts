// services/meals.service.ts
import { env } from "@/env";
import { Meal } from "@/types";


export const mealsService = {
  /**
   * Fetch popular meals (most ordered)
   * @param limit - সংখ্যা নির্ধারণ (ডিফল্ট 6)
   * @returns Promise<Meal[]>
   */
  fetchPopularMeals: async (limit: number = 6): Promise<Meal[]> => {
    try {
      // 1. ব্যাকএন্ডে যদি sort=popular সাপোর্ট করে, তাহলে সেটি ব্যবহার করি
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/meals?sort=popular&limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch meals`);
      }

      const data = await res.json();
      let meals: Meal[] = data.data || data;

      // 2. যদি ব্যাকএন্ড sorting না করে, তাহলে ক্লায়েন্ট সাইডে totalOrders অনুযায়ী সাজাই
      if (Array.isArray(meals) && meals.length && !meals[0]?.totalOrders) {
        console.warn("Backend did not sort by totalOrders; sorting client-side.");
        meals.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
      }

      // 3. লিমিট অনুযায়ী কাটছাঁট
      return meals.slice(0, limit);
    } catch (error) {
      console.error("Error fetching popular meals:", error);
      return []; // ফাঁকা অ্যারে রিটার্ন করি, UI তে হ্যান্ডেল করা হবে
    }
  },

  // অন্যান্য মিলস সম্পর্কিত ফাংশন (যেমন getAllMeals, getMealById) এখানে যোগ করা যেতে পারে
};