export type Provider = {
  id: string;
  restaurantName: string;
  slug?: string;
  logo?: string | null;
  coverImage?: string | null;
  description?: string | null;
  area?: string | null;
  city?: string | null;
  rating?: number;
  deliveryFee: number;
  deliveryTimeMin?: number | null;
  deliveryTimeMax?: number | null;
  minOrderAmount?: number | null;
  isOpen?: boolean;
  isFeatured?: boolean;

  // ✅ এই দুটো add করো
  cuisineType?: string[];
  totalReviews?: number;

  _count?: {
    meals: number;
  };
};