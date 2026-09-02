

"use client";

// src/app/(dashboardLayout)/rider/active-delivery/page.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getActiveDelivery,
  pickupOrder,
  deliverOrder,
  type ActiveDelivery,
} from "@/services/riderDashboardService";

export default function ActiveDeliveryPage() {
  const router = useRouter();
  const [delivery, setDelivery] = useState<ActiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDelivery = async () => {
    try {
      const data = await getActiveDelivery();
      setDelivery(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load delivery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, []);

  const handlePickup = async () => {
    if (!delivery) return;
    setActionLoading(true);
    try {
      await pickupOrder(delivery.orderId);
      toast.success("Marked as picked up 📦");
      await loadDelivery();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!delivery) return;
    setActionLoading(true);
    try {
      const res = await deliverOrder(delivery.orderId);
      toast.success(`Delivered! You earned ৳${res.earnings} 🎉`);
      router.push("/rider/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="text-6xl">🛵</div>
        <h2 className="text-xl font-bold">
          No active delivery right now
        </h2>
        <p className="text-gray-500 max-w-sm">
          Go online from your dashboard to start receiving orders.
        </p>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => router.push("/rider/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isPickedUp = delivery.status === "picked_up" || delivery.status === "on_the_way";

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Active Delivery</h1>
        <Badge className={isPickedUp ? "bg-blue-500" : "bg-orange-500"}>
          {isPickedUp ? "Picked Up" : "Assigned"}
        </Badge>
      </div>

      {/* Restaurant Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            🍽️ {delivery.order.provider.restaurantName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-gray-600">
          <p>📍 {delivery.order.provider.address ?? "Address not available"}</p>
          <p>📞 {delivery.order.provider.contactPhone}</p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Order #{delivery.order.orderNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {delivery.order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.mealName} x{item.quantity}
              </span>
              <span>৳{item.subtotal}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-2 border-t">
            <span>Total</span>
            <span>৳{delivery.order.totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            👤 {delivery.order.customerName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-gray-600">
          <p>📞 {delivery.order.customerPhone}</p>
          <p>📍 {delivery.order.deliveryArea} — {delivery.order.deliveryAddress}</p>
          {delivery.order.deliveryInstructions && (
            <p className="text-xs italic">
              Note: {delivery.order.deliveryInstructions}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="pt-2">
        {!isPickedUp ? (
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
            onClick={handlePickup}
            disabled={actionLoading}
          >
            {actionLoading ? "Updating..." : "📦 I've Picked Up the Food"}
          </Button>
        ) : (
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            size="lg"
            onClick={handleDeliver}
            disabled={actionLoading}
          >
            {actionLoading ? "Updating..." : "✅ Mark as Delivered"}
          </Button>
        )}
      </div>
    </div>
  );
}