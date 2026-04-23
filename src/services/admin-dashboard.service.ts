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

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  provider: { restaurantName: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
}

export const adminDashboardService = {
  // Dashboard Stats
  getStats: async (): Promise<DashboardStats> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
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
      return {
        totalUsers: 0,
        totalProviders: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingProviders: 0,
        activeOrders: 0,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return {
        totalUsers: 0,
        totalProviders: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingProviders: 0,
        activeOrders: 0,
      };
    }
  },

  // Users Management
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  },

  updateUserStatus: async (userId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/status`, {
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
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/providers`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch providers:", error);
      return [];
    }
  },

  approveProvider: async (providerId: string, isApproved: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/providers/${providerId}/approve`, {
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
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/providers/${providerId}/featured`, {
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

  // Orders Management
  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  },

  // Categories Management
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  createCategory: async (data: { name: string; slug: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories`, {
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
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
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
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
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