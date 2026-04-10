// src/services/category.service.ts
import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const CategoryService = {
  getCategories: async function () {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      return data.data || data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return []; // fallback empty array
    }
  },


  







};
