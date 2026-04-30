import { create } from "zustand";

import { env } from "@/env";
import { authClient } from "@/lib/auth-client";

export interface CartItem {
  id: string;
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  providerId?: string;
  providerName?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (mealId: string, quantity: number) => Promise<void>;
  removeItem: (mealId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  // Helper functions (synchronous)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    // Check if user is authenticated first
    try {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        // No valid session, clear cart and return
        set({ items: [], isLoading: false });
        return;
      }
    } catch (error) {
      // If we can't check session, assume not authenticated
      console.warn("Could not verify authentication status:", error);
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/cart`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 403) {
          // User not authorized, clear cart
          set({ items: [], isLoading: false });
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        const items = data.data?.items?.map((item: any) => ({
          id: item.id,
          mealId: item.mealId,
          name: item.meal.name,
          price: item.meal.price,
          quantity: item.quantity,
          thumbnail: item.meal.thumbnail,
          providerId: item.meal.providerId,
          providerName: item.meal.provider?.restaurantName,
        })) || [];
        set({ items });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: item.mealId,
          quantity: item.quantity,
        }),
        credentials: "include",
      });
      if (res.status === 403) {
        console.warn("User not authenticated, cannot add item to cart");
        return;
      }
      if (res.ok) {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  },

  updateQuantity: async (mealId, quantity) => {
    try {
      const item = get().items.find((i) => i.mealId === mealId);
      if (!item) return;
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      if (res.status === 403) {
        console.warn("User not authenticated, cannot update cart item");
        return;
      }
      if (res.ok) {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  },

  removeItem: async (mealId) => {
    try {
      const item = get().items.find((i) => i.mealId === mealId);
      if (!item) return;
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/cart/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 403) {
        console.warn("User not authenticated, cannot remove cart item");
        return;
      }
      if (res.ok) {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  },

  clearCart: async () => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 403) {
        console.warn("User not authenticated, cannot clear cart");
        return;
      }
      if (res.ok) {
        set({ items: [] });
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },

  // ✅ Helper functions (synchronous - work with current state)
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getDeliveryFee: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 && subtotal < 500 ? 50 : 0;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getDeliveryFee();
  },
}));
