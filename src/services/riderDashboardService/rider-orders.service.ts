// src/services/riderDashboardService/rider-orders.service.ts

import { fetchJSON, API } from "./fetchClient";
import { AvailableOrder } from "./types";

// Available Orders দেখা (READY status, কেউ নেয়নি)
export const getAvailableOrders = async (): Promise<AvailableOrder[]> => {
  const res = await fetchJSON(`${API}/api/rider/orders/available`);
  return res.data;
};

// Order Accept করা
export const acceptOrder = async (orderId: string): Promise<void> => {
  await fetchJSON(`${API}/api/rider/orders/${orderId}/accept`, {
    method: "POST",
  });
};