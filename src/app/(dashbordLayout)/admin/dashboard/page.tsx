"use client";

import { useEffect, useState } from "react";
import {  adminDashboardService, DashboardStats as StatsType } from "@/services/admin-dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/layout/Dashboard_layout/dashboard-stats";
import { RevenueChart } from "@/components/layout/Dashboard_layout/revenue-chart";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await adminDashboardService.getStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      <DashboardStats stats={stats} />

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Orders Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold">{stats.activeOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}