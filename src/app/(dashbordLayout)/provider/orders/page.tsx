"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Package,
  Eye,
  ChefHat,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Bike,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import {
  providerDashboardService,
  Order,
} from "@/services/providerDashboardService/provider-dashboard.service";
import { toast } from "sonner";

// ── Status config ─────────────────────────────────────────────────────────────

type OrderStatus = Order["status"];

const statusConfig: Record<
  string,
  { label: string; bg: string; icon: React.ReactNode }
> = {
  placed: {
    label: "Placed",
    bg: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <ShoppingBag className="h-3 w-3" />,
  },
  preparing: {
    label: "Preparing",
    bg: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <ChefHat className="h-3 w-3" />,
  },
  ready: {
    label: "Ready",
    bg: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <Bike className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    label: status,
    bg: "bg-gray-100 text-gray-600 border-gray-200",
    icon: null,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// Allowed next statuses per current status (backend transitions)
const nextStatuses: Record<string, { value: OrderStatus; label: string }[]> = {
  placed: [
    { value: "preparing", label: "Start Preparing" },
    { value: "cancelled", label: "Cancel" },
  ],
  preparing: [{ value: "ready", label: "Mark Ready" }],
  ready: [{ value: "delivered", label: "Mark Delivered" }],
  delivered: [],
  cancelled: [],
};

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            Order #{order.orderNumber}
            <StatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Customer info */}
          <div className="rounded-xl bg-gray-50 border p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Customer
            </p>
            <p className="font-semibold text-gray-900">{order.customerName}</p>
            {order.customerPhone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {order.customerPhone}
              </p>
            )}
            {order.deliveryAddress && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {order.deliveryAddress}
                {order.deliveryArea ? `, ${order.deliveryArea}` : ""}
              </p>
            )}
            {order.deliveryInstructions && (
              <p className="text-xs text-muted-foreground italic">
                "{order.deliveryInstructions}"
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Items
            </p>
            <div className="rounded-xl border overflow-hidden divide-y">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-500">
                      x{item.quantity}
                    </span>
                    <span className="text-gray-800">{item.mealName}</span>
                  </div>
                  <span className="font-semibold text-gray-700">
                    ৳{item.subtotal ?? item.mealPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>৳{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>৳{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-orange-200">
              <span>Total</span>
              <span>৳{order.totalAmount}</span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.preparingAt && (
              <p>Preparing started: {new Date(order.preparingAt).toLocaleString()}</p>
            )}
            {order.readyAt && (
              <p>Ready at: {new Date(order.readyAt).toLocaleString()}</p>
            )}
            {order.deliveredAt && (
              <p>Delivered at: {new Date(order.deliveredAt).toLocaleString()}</p>
            )}
            {order.cancelledAt && (
              <p className="text-red-500">
                Cancelled at: {new Date(order.cancelledAt).toLocaleString()}
                {order.cancellationReason
                  ? ` — "${order.cancellationReason}"`
                  : ""}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const ALL_FILTERS = ["all", "placed", "preparing", "ready", "delivered", "cancelled"] as const;
type Filter = (typeof ALL_FILTERS)[number];

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await providerDashboardService.getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const ok = await providerDashboardService.updateOrderStatus(orderId, newStatus);
    if (ok) {
      toast.success(`Order marked as ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } else {
      toast.error("Failed to update status");
    }
    setUpdatingId(null);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  // summary counts
  const counts = {
    placed: orders.filter((o) => o.status === "placed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  return (
    <div className="space-y-6 p-1">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage incoming orders from customers
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Placed", value: counts.placed, icon: <ShoppingBag className="h-3.5 w-3.5 text-blue-500" /> },
          { label: "Preparing", value: counts.preparing, icon: <ChefHat className="h-3.5 w-3.5 text-yellow-500" /> },
          { label: "Ready", value: counts.ready, icon: <Bike className="h-3.5 w-3.5 text-purple-500" /> },
        ].map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-2 rounded-xl border bg-gray-50 px-4 py-2 text-sm"
          >
            {c.icon}
            <span className="text-muted-foreground">{c.label}:</span>
            <span className="font-bold text-gray-800">{c.value}</span>
          </div>
        ))}
      </div>

      {/* Search + filter tabs */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex rounded-lg border overflow-hidden text-xs flex-wrap">
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 capitalize transition-colors ${
                filter === f
                  ? "bg-orange-500 text-white font-semibold"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-gray-50">
          <Package className="h-10 w-10 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-600">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? "Try a different search term"
              : "Orders will appear here when customers place them"}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Update Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const next = nextStatuses[order.status] ?? [];
                const isUpdating = updatingId === order.id;

                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    {/* order number */}
                    <TableCell className="font-bold text-gray-800">
                      #{order.orderNumber}
                    </TableCell>

                    {/* customer */}
                    <TableCell>
                      <p className="font-medium text-gray-800">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-xs text-muted-foreground">
                          {order.customerPhone}
                        </p>
                      )}
                    </TableCell>

                    {/* items */}
                    <TableCell>
                      <p className="text-sm text-gray-700">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {order.items.map((i) => i.mealName).join(", ")}
                      </p>
                    </TableCell>

                    {/* amount */}
                    <TableCell className="font-bold text-gray-800">
                      ৳{order.totalAmount.toLocaleString()}
                    </TableCell>

                    {/* status badge */}
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>

                    {/* date */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <br />
                      <span className="text-xs">
                        {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>

                    {/* update status */}
                    <TableCell>
                      {next.length > 0 ? (
                        <Select
                          value=""
                          onValueChange={(val) =>
                            handleStatusUpdate(order.id, val as OrderStatus)
                          }
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-[150px] h-8 text-xs">
                            <SelectValue
                              placeholder={
                                isUpdating ? "Updating..." : "Change status"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {next.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className={
                                  opt.value === "cancelled"
                                    ? "text-red-600"
                                    : ""
                                }
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No action
                        </span>
                      )}
                    </TableCell>

                    {/* view detail */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                        onClick={() => setViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order detail modal */}
      <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />
    </div>
  );
}