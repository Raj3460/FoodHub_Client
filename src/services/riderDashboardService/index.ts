// src/services/riderDashboardService.ts

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ───────────────────────────────────────────────

export type RiderStatus = "online" | "offline" | "busy";

export type RiderProfile = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  vehicleType: string;
  status: RiderStatus;
  isApproved: boolean;
  isSuspended: boolean;
  suspendReason: string | null;
  totalEarnings: number;
  totalDeliveries: number;
  rating: number;
};

export type RiderStats = {
  todayEarnings: number;
  todayDeliveries: number;
  weekEarnings: number;
  weekDeliveries: number;
  totalEarnings: number;
  totalDeliveries: number;
  rating: number;
};

export type AvailableOrder = {
  id: string;
  orderNumber: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryFee: number;
  totalAmount: number;
  provider: {
    restaurantName: string;
    address: string | null;
    area: string | null;
    contactPhone: string;
  };
  items: {
    mealName: string;
    quantity: number;
  }[];
};

// ─── Base Fetch Helper ────────────────────────────────────

const fetchJSON = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── Service Functions ────────────────────────────────────

// Profile + Stats একসাথে (Dashboard load এ)
export const getRiderDashboardData = async (): Promise<{
  profile: RiderProfile;
  stats: RiderStats;
}> => {
  const [profileRes, statsRes] = await Promise.all([
    fetchJSON(`${API}/api/rider/profile`),
    fetchJSON(`${API}/api/rider/stats`),
  ]);
  return {
    profile: profileRes.data,
    stats: statsRes.data,
  };
};

// Available Orders
export const getAvailableOrders = async (): Promise<AvailableOrder[]> => {
  const res = await fetchJSON(`${API}/api/rider/orders/available`);
  return res.data;
};

// Status Update
export const updateRiderStatus = async (status: RiderStatus): Promise<void> => {
  await fetchJSON(`${API}/api/rider/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

// Order Accept
export const acceptOrder = async (orderId: string): Promise<void> => {
  await fetchJSON(`${API}/api/rider/orders/${orderId}/accept`, {
    method: "POST",
  });
};

// Order Pickup
export const pickupOrder = async (orderId: string): Promise<void> => {
  await fetchJSON(`${API}/api/rider/orders/${orderId}/pickup`, {
    method: "PATCH",
  });
};

// Order Deliver
export const deliverOrder = async (
  orderId: string
): Promise<{ earnings: number }> => {
  const res = await fetchJSON(`${API}/api/rider/orders/${orderId}/deliver`, {
    method: "PATCH",
  });
  return { earnings: res.earnings };
};

// Location Update
export const updateRiderLocation = async (
  lat: number,
  lng: number
): Promise<void> => {
  await fetchJSON(`${API}/api/rider/location`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });
};