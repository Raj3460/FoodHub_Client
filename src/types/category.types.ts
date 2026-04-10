// types/category.ts

import { Meal } from "./meals.types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    meals: number;
  };
  meals?: Meal[];
}

// export interface MealPreview {
//   id: string;
//   name: string;
//   price: number;
//   thumbnail?: string | null;
//   provider?: {
//     restaurantName: string;
//   };
// }

// API Response Wrapper (যদি আপনার ব্যাকএন্ড এভাবে রেসপন্স দেয়)
export interface CategoryResponse {
  success: boolean;
  data: Category | Category[];
  total?: number;
  message?: string;
}

// Create Category Payload (Admin only)
export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  displayOrder?: number;
}

// Update Category Payload (Admin only)
export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
}