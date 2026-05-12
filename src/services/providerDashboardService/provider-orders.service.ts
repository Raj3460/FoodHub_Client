// src/services/providerDashboardService/provider-orders.service.ts
import { env } from "@/env";
import type { Order } from "./types";

export const getProviderOrders = async (): Promise<Order[]> => {
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
};

export const updateOrderStatus = async (
  orderId: string,
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
};