"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  totalAmount: number;
  createdAt: string;
  placedAt: string;
  items: OrderItem[];
  provider: {
    restaurantName: string;
    logo?: string;
  };
}

const statusConfig = {
  placed: { label: "Placed", icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300" },
  preparing: { label: "Preparing", icon: CookingPot, color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-300" },
  ready: { label: "Ready", icon: Truck, color: "bg-purple-500", textColor: "text-purple-700 dark:text-purple-300" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-700 dark:text-green-300" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500", textColor: "text-red-700 dark:text-red-300" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!isMounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">No orders yet</h2>
        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
        <Button asChild className="mt-6 bg-orange-500 hover:bg-orange-600">
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-gray-500">Track and manage your orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          const status = statusConfig[order.status];

          return (
            <Card key={order.id} className="overflow-hidden transition hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 bg-gray-50 dark:bg-gray-900">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={`${status.color} text-white`}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-4">
                  {/* Restaurant Info */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      {order.provider?.logo ? (
                        <img src={order.provider.logo} alt="" className="h-6 w-6 rounded-full" />
                      ) : (
                        <span className="text-sm font-bold">
                          {order.provider?.restaurantName?.charAt(0) || "R"}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{order.provider?.restaurantName}</span>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}× {item.mealName}
                        </span>
                        <span>₹{item.subtotal}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-orange-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}