// src/app/(dashbordLayout)/provider/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Utensils,
  ShoppingBag,
  Clock,
  Star,
  TrendingUp,
  ChefHat,
  CheckCircle2,
  XCircle,
  Bike,
} from "lucide-react";
import type {
  ProviderStats,
  Order,
  Meal,
} from "@/services/providerDashboardService";
import {
  getProviderStats,
  getProviderOrders,
  getMyMeals,
} from "@/services/providerDashboardService";
import { Skeleton } from "@/components/ui/skeleton";

// ── Service wrapper (keeps the old calling style) ─────────────────────────
const providerDashboardService = {
  getStats: getProviderStats,
  getOrders: getProviderOrders,
  getMyMeals: getMyMeals,
};

// ── Status badge helper ────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  placed: {
    label: "Placed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <ShoppingBag className="h-3 w-3" />,
  },
  preparing: {
    label: "Preparing",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <ChefHat className="h-3 w-3" />,
  },
  ready: {
    label: "Ready",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <Bike className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Stat card skeleton ─────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ProviderDashboardPage() {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topMeals, setTopMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // All functions are already imported above – just call them
      const [statsData, ordersData, mealsData] = await Promise.all([
        providerDashboardService.getStats(),
        providerDashboardService.getOrders(),
        providerDashboardService.getMyMeals(),
      ]);

      setStats(statsData);
      // সর্বশেষ ৫টি order
      setRecentOrders(ordersData.slice(0, 5));
      // সবচেয়ে বেশি order হয়েছে এমন ৫টি meal
      setTopMeals(
        [...mealsData]
          .sort((a, b) => (b.totalOrders ?? 0) - (a.totalOrders ?? 0))
          .slice(0, 5)
      );
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ── Stat cards config ────────────────────────────────────────────────────
  const statItems = [
    {
      title: "Total Meals",
      value: stats?.totalMeals ?? 0,
      icon: Utensils,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: null,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: null,
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trend: null,
    },
    {
      title: "Avg. Rating",
      value:
        stats?.averageRating && stats.averageRating > 0
          ? stats.averageRating.toFixed(1)
          : "—",
      icon: Star,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: null,
    },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Provider Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your restaurant and track performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 border rounded-lg px-3 py-2">
          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          Live overview
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((stat) => (
            <Card
              key={stat.title}
              className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Orders + Top Meals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Recent Orders
              </CardTitle>
              <a
                href="/provider/orders"
                className="text-xs text-orange-500 hover:underline font-medium"
              >
                View all →
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingBag className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-gray-800">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerName} &middot;{" "}
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={order.status} />
                    <p className="text-xs font-semibold text-gray-700">
                      ৳{order.totalAmount}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Meals */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Top Selling Meals
              </CardTitle>
              <a
                href="/provider/menu"
                className="text-xs text-orange-500 hover:underline font-medium"
              >
                Manage menu →
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))
            ) : topMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Utensils className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No meals added yet
                </p>
              </div>
            ) : (
              topMeals.map((meal, idx) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  {/* rank */}
                  <span className="text-xs font-bold text-gray-400 w-4">
                    {idx + 1}
                  </span>

                  {/* thumbnail */}
                  {meal.thumbnail ? (
                    <img
                      src={meal.thumbnail}
                      alt={meal.name}
                      className="h-9 w-9 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Utensils className="h-4 w-4 text-orange-400" />
                    </div>
                  )}

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {meal.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meal.totalOrders ?? 0} orders &middot; ৳{meal.price}
                    </p>
                  </div>

                  {/* availability */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      meal.isAvailable
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    {meal.isAvailable ? "Available" : "Off"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}