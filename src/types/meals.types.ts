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
    slug?: string;
  };
}



export interface MealDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  thumbnail?: string;
  rating: number;
  totalReviews: number;
  totalOrders: number;    // ✅ add
  viewCount?: number;     // ✅ add
  preparationTime?: number;
  calories?: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  ingredients: string[];
  providerId?: string;    // ✅ add
  categoryId?: string;    // ✅ add
  provider: {
    id: string;
    restaurantName: string;
    area?: string;
    city?: string;
    address?: string;
    deliveryFee: number;
    minOrderAmount: number;
    rating: number;
    isOpen: boolean;
  };
  category: {
    name: string;
    icon?: string;        // ✅ add
    slug?: string;        // ✅ add
  };
  reviews: {
    id: string;
    rating: number;
    comment: string;
    customerName: string;
    createdAt: string;
  }[];
}