export interface Meal {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  ingredients?: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime?: number;
  calories?: number;
  rating: number;
  totalReviews: number;
  totalOrders: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  categoryId: string;
  provider?: {
    restaurantName: string;
    area?: string;
    rating?: number;
  };
  category?: {
    name: string;
    icon?: string;
  };
}
