// src/services/admin-dashboard.service.ts

import { env } from "@/env";

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalOrders: number;
  totalRevenue: number;
  pendingProviders: number;
  activeOrders: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  restaurantName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  isApproved: boolean;
  isFeatured: boolean;
  rating: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  mealName: string;
  mealPrice: number;
  quantity: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  cancellationReason?: string;
  createdAt: string;
  placedAt: string;
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  provider: { restaurantName: string };
  items: OrderItem[];
}

export interface OrderStats {
  total: number;
  placed: number;
  preparing: number;
  delivered: number;
  cancelled: number;
  todayRevenue: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: { meals: number };
}

export const adminDashboardService = {
  // Dashboard Stats
  getStats: async (): Promise<DashboardStats> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        return {
          totalUsers: data.data.totalUsers ?? 0,
          totalProviders: data.data.totalProviders ?? 0,
          totalOrders: data.data.totalOrders ?? 0,
          totalRevenue: data.data.totalRevenue ?? 0,
          pendingProviders: data.data.pendingProviders ?? 0,
          activeOrders: data.data.activeOrders ?? 0,
        };
      }
      return { totalUsers: 0, totalProviders: 0, totalOrders: 0, totalRevenue: 0, pendingProviders: 0, activeOrders: 0 };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return { totalUsers: 0, totalProviders: 0, totalOrders: 0, totalRevenue: 0, pendingProviders: 0, activeOrders: 0 };
    }
  },

  // Users Management
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/users`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  },

  updateUserStatus: async (userId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to update user status:", error);
      return false;
    }
  },

  // Providers Management
  getProviders: async (): Promise<Provider[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/providers`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch providers:", error);
      return [];
    }
  },

  approveProvider: async (providerId: string, isApproved: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/providers/${providerId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to approve provider:", error);
      return false;
    }
  },

  toggleFeatured: async (providerId: string, isFeatured: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/admin/providers/${providerId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured }),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      return false;
    }
  },

  // ✅ Orders — pagination + filter + search
  getOrders: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<OrdersResponse> => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.status && params.status !== "all") query.set("status", params.status);
      if (params.search) query.set("search", params.search);

      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/orders/admin?${query.toString()}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return {
        orders: data.orders || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return { orders: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
  },

  // ✅ Order stats — summary cards এর জন্য
  getOrderStats: async (): Promise<OrderStats> => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/orders/admin/stats`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || { total: 0, placed: 0, preparing: 0, delivered: 0, cancelled: 0, todayRevenue: 0 };
    } catch (error) {
      console.error("Failed to fetch order stats:", error);
      return { total: 0, placed: 0, preparing: 0, delivered: 0, cancelled: 0, todayRevenue: 0 };
    }
  },

  // ✅ Admin cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/orders/admin/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
          credentials: "include",
        }
      );
      return res.ok;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      return false;
    }
  },

  // Categories Management
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/categories`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  createCategory: async (data: { name: string; slug: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to create category:", error);
      return false;
    }
  },

  updateCategory: async (id: string, data: { name: string; slug: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to update category:", error);
      return false;
    }
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.ok;
    } catch (error) {
      console.error("Failed to delete category:", error);
      return false;
    }
  },
};