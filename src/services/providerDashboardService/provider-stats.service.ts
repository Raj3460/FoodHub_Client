// src/services/providerDashboardService/provider-stats.service.ts
import { env } from "@/env";
import type { ProviderStats } from "./types";

export const getProviderStats = async (): Promise<ProviderStats> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/stats`, {
      credentials: "include",
    });
    if (!res.ok) {
      console.warn(`Provider stats request failed: ${res.status}`);
      return { totalMeals: 0, totalOrders: 0, pendingOrders: 0, averageRating: 0 };
    }
    const data = await res.json();
    if (data.success) {
      return {
        totalMeals: data.data.totalMeals ?? 0,
        totalOrders: data.data.totalOrders ?? 0,
        pendingOrders: data.data.pendingOrders ?? 0,
        averageRating: data.data.averageRating ?? 0,
      };
    }
    return { totalMeals: 0, totalOrders: 0, pendingOrders: 0, averageRating: 0 };
  } catch (error) {
    console.error("Failed to fetch provider stats:", error);
    return { totalMeals: 0, totalOrders: 0, pendingOrders: 0, averageRating: 0 };
  }
};