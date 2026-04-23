"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingBag, Clock, Star } from "lucide-react";
import { providerDashboardService, ProviderStats } from "@/services/provider-dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await providerDashboardService.getStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    { title: "Total Meals", value: stats?.totalMeals || 0, icon: Utensils, color: "text-orange-500" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-500" },
    { title: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-500" },
    { title: "Average Rating", value: stats?.averageRating?.toFixed(1) || "New", icon: Star, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Provider Dashboard</h1>
        <p className="text-muted-foreground">Manage your restaurant and track performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}