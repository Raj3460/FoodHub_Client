 export interface Provider {
  id: string;
  restaurantName: string;
  logo?: string;
  coverImage?: string;
  rating: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  deliveryFee: number;
  minOrderAmount: number;
  city?: string;
  area?: string;
  isOpen: boolean;
}
