// services/providers.service.ts

import { env } from "@/env";


export const featuredProviderService = {
  getAllProvidersWhereFeaturedIsTrue: async () => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/providers?isFeatured=true`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching featured providers:", error);
      return []; // fallback empty array
    }
  },
};
