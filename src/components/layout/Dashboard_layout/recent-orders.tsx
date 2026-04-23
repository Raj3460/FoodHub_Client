"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersProps {
  orders: Order[] | undefined;  // ✅ undefined allowed
}

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  preparing: "bg-blue-100 text-blue-700",
  placed: "bg-yellow-100 text-yellow-700",
  ready: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
    });
  };

  // ✅ Fallback if orders is undefined or null
  const orderList = orders ?? [];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orderList.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-700"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}