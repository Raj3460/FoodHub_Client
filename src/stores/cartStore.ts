import { create } from "zustand";

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
    set({ isLoading: true });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        credentials: "include",
      });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: item.mealId,
          quantity: item.quantity,
        }),
        credentials: "include",
      });
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  },

  removeItem: async (mealId) => {
    try {
      const item = get().items.find((i) => i.mealId === mealId);
      if (!item) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  },

  clearCart: async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      set({ items: [] });
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