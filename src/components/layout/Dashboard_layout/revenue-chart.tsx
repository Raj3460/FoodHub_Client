"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ডামি ডাটা (ব্যাকএন্ড রেডি না হওয়া পর্যন্ত)
const dummyRevenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 25000 },
  { month: "Jun", revenue: 30000 },
];

export function RevenueChart() {
  const formatTooltipValue = (value: any) => {
    if (value === undefined) return ["₹0", "Revenue"];
    return [`₹${value.toLocaleString()}`, "Revenue"];
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview (Last 6 Months)  This is demo data , </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `₹${value / 1000}k`} />
              <Tooltip formatter={formatTooltipValue} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}