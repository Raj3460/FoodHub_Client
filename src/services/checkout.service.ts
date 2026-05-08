// services/checkout.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CheckoutData {
  deliveryAddress: string;
  deliveryArea: string;
  deliveryInstructions?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: string;
}

export interface OrderResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
}

export const checkoutService = {
  async placeOrder(orderData: CheckoutData): Promise<OrderResponse> {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, data: { id: data.data.id } };
      }
      return { success: false, message: data.message || "Failed to place order" };
    } catch (error) {
      console.error("Checkout service error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  },
};