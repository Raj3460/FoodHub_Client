import { env } from "@/env";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface ProviderStats {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  averageRating: number;
}

// GET /api/providers/meals — response
export interface Meal {
  id: string;
  providerId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  thumbnail?: string;
  ingredients: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime?: number;
  calories?: number;
  rating: number;
  totalOrders: number;
  category?: { name: string; icon?: string };
}

// POST /api/meals — body
export interface MealCreatePayload {
  providerId: string; // required — backend body থেকে নেয়
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  calories?: number;
}

// PUT /api/meals/:id — body (সব optional)
export interface MealUpdatePayload {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  categoryId?: string;
}

// GET /api/meals?... — query filters
export interface MealFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  minRating?: number;
  sort?: "price_asc" | "price_desc" | "rating_desc";
}

// GET /api/orders/provider — response
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: string;
  deliveryInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  // backend lowercase status ব্যবহার করে
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  cancellationReason?: string;
  createdAt: string;
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items: {
    id: string;
    mealId: string;
    mealName: string;
    mealPrice: number;
    quantity: number;
    subtotal: number;
    specialInstructions?: string;
    meal?: { thumbnail?: string };
  }[];
}

// PUT /api/providers/my/profile — body
export interface ProviderProfileUpdatePayload {
  restaurantName?: string;
  branch?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  area?: string;
  cuisineType?: string;
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  weeklyOff?: string;
  deliveryFee?: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minOrderAmount?: number;
  logo?: string;
  coverImage?: string;
}

// GET /api/providers/my/profile — response
export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  branch?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  area?: string;
  cuisineType?: string;
  isOpen: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  openingTime?: string;
  closingTime?: string;
  weeklyOff?: string;
  deliveryFee: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minOrderAmount: number;
  logo?: string;
  coverImage?: string;
  rating: number;
  totalReviews: number;
  meals: Meal[];
  _count: { meals: number; orders: number };
}

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

export const providerDashboardService = {

  // ── Dashboard Stats ────────────────────────
  // GET /api/providers/stats

  getStats: async (): Promise<ProviderStats> => {
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
  },

  // ── Menu Management ────────────────────────

  // GET /api/providers/meals — provider এর নিজের meals
  getMyMeals: async (): Promise<Meal[]> => {
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
  },

  // GET /api/meals?... — public meal list with filters
  getAllMeals: async (filters?: MealFilters): Promise<Meal[]> => {
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
  },

  // GET /api/meals/:id
  getMealById: async (id: string): Promise<Meal | null> => {
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
  },

  // POST /api/meals — auth: PROVIDER / ADMIN / CUSTOMER
  createMeal: async (payload: MealCreatePayload): Promise<Meal | null> => {
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
  },

  // PUT /api/meals/:id — auth: PROVIDER / ADMIN
  updateMeal: async (id: string, payload: MealUpdatePayload): Promise<Meal | null> => {
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
  },

  // DELETE /api/meals/:id — auth: PROVIDER / ADMIN
  deleteMeal: async (id: string): Promise<boolean> => {
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
  },

  // PUT /api/meals/:id — শুধু isAvailable পাঠাবে
  toggleMealAvailability: async (id: string, isAvailable: boolean): Promise<Meal | null> => {
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
  },

  // ── Orders ─────────────────────────────────

  // GET /api/orders/provider — auth: PROVIDER / ADMIN
  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/orders/provider`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  },

  // PATCH /api/orders/provider/:id/status — auth: PROVIDER only
  // Allowed transitions: placed→preparing, placed→cancelled, preparing→ready, ready→delivered
  updateOrderStatus: async (
    orderId: string,
    // status: "preparing" | "ready" | "delivered" | "cancelled"
    status: Order["status"] 
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/orders/provider/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        }
      );
      return res.ok;
    } catch (error) {
      console.error("Failed to update order status:", error);
      return false;
    }
  },

  // ── Profile ────────────────────────────────

  // GET /api/providers/my/profile — auth: PROVIDER / ADMIN
  getMyProfile: async (): Promise<ProviderProfile | null> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/my/profile`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  },

  // PUT /api/providers/my/profile — auth: PROVIDER / ADMIN
  updateMyProfile: async (
    payload: ProviderProfileUpdatePayload
  ): Promise<ProviderProfile | null> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/providers/my/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        console.warn(`Update profile failed: ${res.status}`);
        return null;
      }
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return null;
    }
  },
};