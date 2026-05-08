// stores/cartStore.ts
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
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  updateQuantity: (mealId: string, quantity: number) => Promise<void>;
  removeItem: (mealId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  // Helpers
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        set({ items: [], isLoading: false });
        return;
      }
    } catch {
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/cart`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 403) set({ items: [] });
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        const items =
          data.data?.items?.map((item: any) => ({
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

  addItem: async (newItem) => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId: newItem.mealId,
          quantity: newItem.quantity,
        }),
        credentials: "include",
      });
      if (res.status === 403) return;
      if (res.ok) {
        // After adding, we still need the server-generated id and possibly updated fields
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  },

  // ✅ OPTIMISTIC UPDATE – changes locally first, then syncs to server
  updateQuantity: async (mealId, quantity) => {
    const existingItem = get().items.find((i) => i.mealId === mealId);
    if (!existingItem) return;

    const oldQuantity = existingItem.quantity;
    const itemId = existingItem.id;

    // 1. Optimistic local update
    set({
      items: get().items.map((item) =>
        item.mealId === mealId ? { ...item, quantity } : item
      ),
    });

    // 2. Call API in background
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      if (res.status === 403) throw new Error("Not authenticated");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Success – nothing else to do
    } catch (error) {
      // 3. Rollback on error
      set({
        items: get().items.map((item) =>
          item.mealId === mealId ? { ...item, quantity: oldQuantity } : item
        ),
      });
      console.error("Failed to update quantity:", error);
      throw error; // re-throw so the UI can show a toast
    }
  },

  removeItem: async (mealId) => {
    const existingItem = get().items.find((i) => i.mealId === mealId);
    if (!existingItem) return;

    const itemId = existingItem.id;
    const removedItem = existingItem;

    // 1. Optimistic remove
    set({ items: get().items.filter((i) => i.mealId !== mealId) });

    // 2. API call
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 403) throw new Error("Not authenticated");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (error) {
      // 3. Rollback – add the item back
      set({ items: [...get().items, removedItem] });
      console.error("Failed to remove item:", error);
      throw error;
    }
  },

  clearCart: async () => {
    const oldItems = get().items;
    set({ items: [] });
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
    } catch (error) {
      set({ items: oldItems });
      console.error("Failed to clear cart:", error);
      throw error;
    }
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getDeliveryFee: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 && subtotal < 500 ? 50 : 0;
  },
  getTotal: () => get().getSubtotal() + get().getDeliveryFee(),
}));