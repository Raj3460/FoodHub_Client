// src/services/riderDashboardService/rider-dashboard.service.ts


import { fetchJSON, API } from "./fetchClient";
import { RiderProfile, RiderStats, RiderStatus, ProfileUpdateInput } from "./types";

// Profile + Stats একসাথে (Dashboard Load এ)
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

// শুধু Profile আলাদা করে আনা লাগলে (Profile Page এ)
export const getRiderProfile = async (): Promise<RiderProfile> => {
  const res = await fetchJSON(`${API}/api/rider/profile`);
  return res.data;
};

// Profile Update
export const updateRiderProfile = async (
  data: ProfileUpdateInput
): Promise<RiderProfile> => {
  const res = await fetchJSON(`${API}/api/rider/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.data;
};

// Status Update (online/offline/busy)
export const updateRiderStatus = async (status: RiderStatus): Promise<void> => {
  await fetchJSON(`${API}/api/rider/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};