// src/services/riderDashboardService/fetchClient.ts

const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchJSON = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export { API };