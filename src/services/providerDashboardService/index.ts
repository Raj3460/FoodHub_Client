// src/services/providerDashboardService/index.ts

// Types
export * from "./types";

// Service functions
export { getProviderStats } from "./provider-stats.service";
export {
  getMyMeals,
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  toggleMealAvailability,
} from "./provider-meals.service";
export { getProviderOrders, updateOrderStatus } from "./provider-orders.service";
export { getMyProfile, updateMyProfile } from "./provider-profile.service";