import { fetchJSON, API } from "./fetchClient";
import { DeliveryHistory, ActiveDelivery } from "./types";

// Order Pickup করা
export const pickupOrder = async (orderId: string): Promise<void> => {
  await fetchJSON(`${API}/api/rider/orders/${orderId}/pickup`, {
    method: "PATCH",
  });
};

// Order Deliver করা
export const deliverOrder = async (
  orderId: string
): Promise<{ earnings: number }> => {
  const res = await fetchJSON(`${API}/api/rider/orders/${orderId}/deliver`, {
    method: "PATCH",
  });
  return { earnings: res.earnings };
};

// এখন চলতে থাকা Active Delivery বের করা (নেই থাকলে null)
export const getActiveDelivery = async (): Promise<ActiveDelivery | null> => {
  const res = await fetch(`${API}/api/rider/deliveries/active`, {
    credentials: "include",
  });
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data.data;
};

// Delivery History (Pagination সহ)
export const getDeliveryHistory = async (
  page = 1,
  limit = 10
): Promise<{ data: DeliveryHistory[]; total: number; totalPages: number }> => {
  const res = await fetchJSON(
    `${API}/api/rider/deliveries?page=${page}&limit=${limit}`
  );
  return res;
};