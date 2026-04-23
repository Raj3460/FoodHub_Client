"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, ShoppingBag, DollarSign, Clock, UserCheck } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalProviders: number;
    totalOrders: number;
    totalRevenue: number;
    pendingProviders: number;
    activeOrders: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Providers",
      value: stats.totalProviders,
      icon: Store,
      color: "text-orange-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Pending Providers",
      value: stats.pendingProviders,
      icon: UserCheck,
      color: "text-yellow-500",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: Clock,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((stat) => (
        <Card key={stat.title} className="transition-all hover:shadow-md">
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
  );
}