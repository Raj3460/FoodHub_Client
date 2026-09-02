import { fetchJSON, API } from "./fetchClient";

// Location Update (GPS Tracking এর জন্য)
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