"use client";

// src/app/(dashboardLayout)/rider/dashboard/page.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getRiderDashboardData,
  getAvailableOrders,
  updateRiderStatus,
  acceptOrder,
  type RiderProfile,
  type RiderStats,
  type RiderStatus,
  type AvailableOrder,
} from "@/services/riderDashboardService";

// ─── Sub-components ───────────────────────────────────────

function PendingApproval({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-6xl">⏳</div>
      <h2 className="text-2xl font-bold text-gray-800">
        Hi {name}, your account is under review
      </h2>
      <p className="text-gray-500 max-w-sm">
        Our team will review your application shortly. You can start accepting
        deliveries once approved.
      </p>
      <Badge variant="outline" className="text-orange-500 border-orange-300 px-4 py-1">
        Pending Admin Approval
      </Badge>
    </div>
  );
}

function SuspendedAccount({ reason }: { reason: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="text-6xl">🚫</div>
      <h2 className="text-2xl font-bold text-gray-800">Account Suspended</h2>
      {reason && <p className="text-gray-500 max-w-sm">Reason: {reason}</p>}
      <p className="text-sm text-gray-400">
        Please contact support for assistance.
      </p>
    </div>
  );
}

function StatsCards({ stats }: { stats: RiderStats }) {
  const cards = [
    { label: "Today's Earnings", value: `৳${stats.todayEarnings}`, icon: "💵" },
    { label: "Today's Deliveries", value: stats.todayDeliveries, icon: "📦" },
    { label: "This Week", value: `৳${stats.weekEarnings}`, icon: "📅" },
    { label: "Total Earnings", value: `৳${stats.totalEarnings}`, icon: "💰" },
    { label: "Total Deliveries", value: stats.totalDeliveries, icon: "🛵" },
    {
      label: "Rating",
      value: stats.rating > 0 ? `${stats.rating.toFixed(1)} ⭐` : "No ratings yet",
      icon: "⭐",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="text-xl font-bold">{card.value}</div>
            <div className="text-xs mt-1 text-gray-500">{card.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrderCard({
  order,
  onAccept,
  accepting,
}: {
  order: AvailableOrder;
  onAccept: (id: string) => void;
  accepting: string | null;
}) {
  const isThisAccepting = accepting === order.id;
  const isAnyAccepting = accepting !== null;

  return (
    <Card className="border border-orange-100 hover:border-orange-300 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              {order.provider.restaurantName}
            </CardTitle>
            <p className="text-xs mt-0.5 text-gray-500">
              📍 {order.provider.area ?? order.provider.address ?? "N/A"}
            </p>
          </div>
          <Badge className="bg-orange-500 text-xs">
            ৳{order.deliveryFee} fee
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-gray-600">
          {order.items.slice(0, 2).map((item, i) => (
            <span key={i}>
              {item.mealName} x{item.quantity}
              {i < Math.min(order.items.length, 2) - 1 ? ", " : ""}
            </span>
          ))}
          {order.items.length > 2 && (
            <span className="text-gray-400"> +{order.items.length - 2} more</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-medium">Deliver to:</span> {order.deliveryArea}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-500">
            Order total: ৳{order.totalAmount}
          </span>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => onAccept(order.id)}
            disabled={isAnyAccepting}
          >
            {isThisAccepting ? "Accepting..." : "Accept"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────
export default function RiderDashboardPage() {
  const [rider, setRider] = useState<RiderProfile | null>(null);
  const [stats, setStats] = useState<RiderStats | null>(null);
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);

  // Accept করার সময় Background Polling বন্ধ রাখার জন্য
  const isAcceptingRef = useRef(false);

  // ─── Load Dashboard Data ─────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { profile, stats } = await getRiderDashboardData();
        setRider(profile);
        setStats(stats);
      } catch (err: any) {
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Fetch Orders (Reusable) ──────────────────────────────
  const fetchOrders = useCallback(async (showLoading = false) => {
    if (isAcceptingRef.current) return; // Accept চলাকালীন Skip করো

    if (showLoading) setOrdersLoading(true);
    try {
      const data = await getAvailableOrders();
      console.log("data", data);
      setOrders(data);
    } catch {
      // Silently fail — Polling এ Toast Spam এড়াতে
    } finally {
      if (showLoading) setOrdersLoading(false);
    }
  }, []);

  // ─── Load Available Orders (Auto-poll) ────────────────────
  useEffect(() => {
    if (!rider?.isApproved || rider.isSuspended || rider.status !== "online") {
      setOrders([]);
      return;
    }

    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 30000);
    return () => clearInterval(interval);
  }, [rider?.isApproved, rider?.isSuspended, rider?.status, fetchOrders]);

  // ─── Toggle Status ───────────────────────────────────────
  const handleToggleStatus = async () => {
    if (!rider) return;
    const newStatus: RiderStatus =
      rider.status === "online" ? "offline" : "online";

    setStatusLoading(true);
    try {
      await updateRiderStatus(newStatus);
      setRider((prev) => (prev ? { ...prev, status: newStatus } : prev));
      toast.success(
        newStatus === "online" ? "You are now online 🟢" : "You are now offline 🔴"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // ─── Accept Order ─────────────────────────────────────────
  const handleAcceptOrder = async (orderId: string) => {
    setAccepting(orderId);
    isAcceptingRef.current = true;
    try {
      await acceptOrder(orderId);
      toast.success("Order accepted! Head to the restaurant 🛵");
      setOrders([]); // Order নেওয়ার পর পুরো List Clear — Rider এখন Busy
      setRider((prev) => (prev ? { ...prev, status: "busy" } : prev));
    } catch (err: any) {
      toast.error(err.message || "Failed to accept order");
      // Order টা হয়তো অন্য কেউ নিয়ে ফেলেছে — List Refresh করো
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      fetchOrders(false);
    } finally {
      setAccepting(null);
      isAcceptingRef.current = false;
    }
  };

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!rider) return null;
  if (rider.isSuspended) return <SuspendedAccount reason={rider.suspendReason} />;
  if (!rider.isApproved) return <PendingApproval name={rider.name} />;

  // ─── Main UI ──────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Hey, {rider.name}! 👋</h1>
          <p className="text-sm text-gray-500">
            {rider.vehicleType} • {rider.area ?? "N/A"}
          </p>
        </div>

        <Button
          onClick={handleToggleStatus}
          disabled={statusLoading || rider.status === "busy"}
          className={
            rider.status === "online"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : rider.status === "busy"
              ? "bg-orange-400 text-white cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }
        >
          {rider.status === "online"
            ? "🟢 Online"
            : rider.status === "busy"
            ? "🔵 Busy"
            : "⚫ Offline"}
        </Button>
      </div>

      {/* Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* Available Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">
            Available Orders
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {orders.length} orders
            </Badge>
            {rider.status === "online" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => fetchOrders(true)}
                disabled={ordersLoading}
              >
                {ordersLoading ? "..." : "🔄 Refresh"}
              </Button>
            )}
          </div>
        </div>

        {rider.status === "offline" && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">😴</p>
            <p className="text-sm">You are offline. Go online to see orders.</p>
          </div>
        )}

        {rider.status === "busy" && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🛵</p>
            <p className="text-sm">You have an active delivery in progress.</p>
            <Button
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => (window.location.href = "/rider/active-delivery")}
            >
              View Active Delivery
            </Button>
          </div>
        )}

        {rider.status === "online" && !ordersLoading && orders.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🕐</p>
            <p className="text-sm">No orders available right now. Stay online!</p>
          </div>
        )}

        {rider.status === "online" && ordersLoading && orders.length === 0 && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        )}

        {rider.status === "online" && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
                accepting={accepting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}