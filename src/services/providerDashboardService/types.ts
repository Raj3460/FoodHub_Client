// src/services/providerDashboardService/types.ts

export interface ProviderStats {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  averageRating: number;
}

export interface Meal {
  id: string;
  providerId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  thumbnail?: string;
  ingredients: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime?: number;
  calories?: number;
  rating: number;
  totalOrders: number;
  category?: { name: string; icon?: string };
}

export interface MealCreatePayload {
  providerId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  calories?: number;
}

export interface MealUpdatePayload {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  images?: string[];
  thumbnail?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  categoryId?: string;
}

export interface MealFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  minRating?: number;
  sort?: "price_asc" | "price_desc" | "rating_desc";
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  providerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: string;
  deliveryInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  cancellationReason?: string;
  createdAt: string;
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items: {
    id: string;
    mealId: string;
    mealName: string;
    mealPrice: number;
    quantity: number;
    subtotal: number;
    specialInstructions?: string;
    meal?: { thumbnail?: string };
  }[];
}

export interface ProviderProfileUpdatePayload {
  restaurantName?: string;
  branch?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  area?: string;
  cuisineType?: string;
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  weeklyOff?: string;
  deliveryFee?: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minOrderAmount?: number;
  logo?: string;
  coverImage?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  branch?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  city?: string;
  area?: string;
  cuisineType?: string;
  isOpen: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  openingTime?: string;
  closingTime?: string;
  weeklyOff?: string;
  deliveryFee: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minOrderAmount: number;
  logo?: string;
  coverImage?: string;
  rating: number;
  totalReviews: number;
  meals: Meal[];
  _count: { meals: number; orders: number };
}