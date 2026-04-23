import { env } from "@/env";

export interface ProviderStats {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  averageRating: number;
}

export interface Meal {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  isAvailable: boolean;
  totalOrders: number;
  rating: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { quantity: number; mealName: string }[];
}

export const providerDashboardService = {
  getStats: async (): Promise<ProviderStats> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/providers/stats`, {
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
  },

  getMeals: async (): Promise<Meal[]> => {
    try {
     const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/providers/meals`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.data || [];
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      return [];
    }
  },



  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orders/provider`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orders/provider/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to update order status:", error);
      return false;
    }
  },
};