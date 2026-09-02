// src/services/riderDashboardService/types.ts

export type RiderStatus = "online" | "offline" | "busy";

export type RiderProfile = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  vehicleType: string;
  vehicleNumber: string | null;
  status: RiderStatus;
  isApproved: boolean;
  isSuspended: boolean;
  suspendReason: string | null;
  totalEarnings: number;
  totalDeliveries: number;
  rating: number;
  totalReviews: number;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
};

export type RiderStats = {
  todayEarnings: number;
  todayDeliveries: number;
  weekEarnings: number;
  weekDeliveries: number;
  totalEarnings: number;
  totalDeliveries: number;
  rating: number;
};

export type AvailableOrder = {
  id: string;
  orderNumber: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryFee: number;
  totalAmount: number;
  provider: {
    restaurantName: string;
    address: string | null;
    area: string | null;
    contactPhone: string;
  };
  items: {
    mealName: string;
    quantity: number;
  }[];
};

export type ActiveDelivery = {
  id: string;
  orderId: string;
  status: string;
  earnings: number;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  assignedAt: string;
  pickedAt: string | null;
  order: {
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    deliveryArea: string;
    deliveryAddress: string;
    deliveryInstructions: string | null;
    provider: {
      restaurantName: string;
      address: string | null;
      contactPhone: string;
    };
    items: {
      mealName: string;
      quantity: number;
      subtotal: number;
    }[];
  };
};

export type DeliveryHistory = {
  id: string;
  orderId: string;
  status: string;
  earnings: number;
  assignedAt: string;
  deliveredAt: string | null;
  order: {
    orderNumber: string;
    totalAmount: number;
    deliveryArea: string;
    customerName: string;
    provider: {
      restaurantName: string;
    };
  };
};

export type ProfileUpdateInput = {
  name?: string;
  phone?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  area?: string;
};