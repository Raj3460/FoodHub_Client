"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Package,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CookingPot,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  mealId: string;
  mealName: string;
  quantity: number;
  mealPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  placedAt: string;
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  deliveryAddress: string;
  deliveryArea: string;
  deliveryInstructions?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  provider: {
    id: string;
    restaurantName: string;
    contactPhone?: string;
    logo?: string;
  };
}

const statusSteps = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: CookingPot },
  { key: "ready", label: "Ready", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  placed: { label: "Placed", icon: Clock, color: "bg-yellow-500" },
  preparing: { label: "Preparing", icon: CookingPot, color: "bg-blue-500" },
  ready: { label: "Ready", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error(data.message || "Order not found");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Something went wrong");
      router.push("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by customer" }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrder();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Something went wrong");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentStepIndex = () => {
    if (order?.status === "cancelled") return -1;
    const index = statusSteps.findIndex((step) => step.key === order?.status);
    return index >= 0 ? index : 0;
  };

  if (!isMounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const StatusIcon = statusConfig[order.status].icon;
  const currentStep = getCurrentStepIndex();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Header */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Order #{order.orderNumber}</CardTitle>
                <p className="text-sm text-gray-500">Placed on {formatDate(order.placedAt)}</p>
              </div>
              <Badge className={`${statusConfig[order.status].color} text-white`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig[order.status].label}
              </Badge>
            </CardHeader>
          </Card>

          {/* Status Timeline (only if not cancelled) */}
          {order.status !== "cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    return (
                      <div key={step.key} className="relative mb-6 flex items-start last:mb-0">
                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                            isCompleted
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className={`font-medium ${isCompleted ? "text-foreground" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {isCurrent && order[`${step.key}At` as keyof Order] && (
                            <p className="text-xs text-gray-500">
                              {formatDate(order[`${step.key}At` as keyof Order] as string)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancelled Info */}
          {order.status === "cancelled" && order.cancellationReason && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Order Cancelled</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{order.cancellationReason}</p>
                    {order.cancelledAt && (
                      <p className="text-xs text-red-500 mt-1">Cancelled on {formatDate(order.cancelledAt)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.mealName}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-400 italic">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <p className="font-medium">₹{item.subtotal}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                <p className="text-sm text-gray-600">Area: {order.deliveryArea}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              {order.deliveryInstructions && (
                <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm dark:bg-gray-800">
                  <p className="text-xs text-gray-500">Instructions:</p>
                  <p className="text-sm">{order.deliveryInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  {order.provider.logo ? (
                    <img src={order.provider.logo} alt="" className="h-6 w-6 rounded-full" />
                  ) : (
                    <span className="text-sm font-bold">{order.provider.restaurantName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{order.provider.restaurantName}</p>
                  {order.provider.contactPhone && (
                    <p className="text-xs text-gray-500">📞 {order.provider.contactPhone}</p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/providers/${order.provider.id}`}>View Restaurant</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Cancel Button (only if status is placed) */}
          {order.status === "placed" && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}