"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Eye, XCircle, ChevronLeft, ChevronRight,
  ShoppingBag, Clock, CheckCircle, TrendingUp, Utensils,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminDashboardService, Order, OrderStats,
} from "@/services/admin-dashboard.service";

// Status badge colors
const statusConfig: Record<string, { label: string; className: string }> = {
  placed:    { label: "Placed",    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800" },
  preparing: { label: "Preparing", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800" },
  ready:     { label: "Ready",     className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
};

const STATUS_FILTERS = ["all", "placed", "preparing", "ready", "delivered", "cancelled"];
const LIMIT = 10;

export default function AdminOrdersPage() {
  // Stats
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Search debounce
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter
  const [statusFilter, setStatusFilter] = useState("all");

  // Details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Cancel dialog
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Fetch stats
  const fetchStats = async () => {
    setStatsLoading(true);
    const data = await adminDashboardService.getOrderStats();
    setStats(data);
    setStatsLoading(false);
  };

  // Fetch orders
  const fetchOrders = async (page = 1, status = "all", search = "") => {
    setLoading(true);
    const result = await adminDashboardService.getOrders({
      page,
      limit: LIMIT,
      status,
      search,
    });
    setOrders(result.orders);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch on filter/search/page change
  useEffect(() => {
    fetchOrders(currentPage, statusFilter, searchQuery);
  }, [currentPage, statusFilter, searchQuery]);

  // Status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // View details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Cancel order
  const handleCancelClick = (order: Order) => {
    setCancelOrder(order);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelOrder) return;
    setCancelling(true);
    const success = await adminDashboardService.cancelOrder(cancelOrder.id, cancelReason);
    if (success) {
      toast.success("Order cancelled successfully");
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelOrder.id ? { ...o, status: "cancelled" } : o
        )
      );
      fetchStats(); // stats update
    } else {
      toast.error("Failed to cancel order");
    }
    setCancelling(false);
    setCancelDialogOpen(false);
    setCancelOrder(null);
  };

  // Pagination numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce<(number | "...")[]>((acc, page, idx, arr) => {
      if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all platform orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statsLoading ? (
          [...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <StatCard
              icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
              label="Total Orders"
              value={stats?.total ?? 0}
              bg="bg-blue-50 dark:bg-blue-950/30"
            />
            <StatCard
              icon={<ShoppingBag className="h-5 w-5 text-yellow-500" />}
              label="Placed"
              value={stats?.placed ?? 0}
              bg="bg-yellow-50 dark:bg-yellow-950/30"
            />
            <StatCard
              icon={<Utensils className="h-5 w-5 text-purple-500" />}
              label="Preparing"
              value={stats?.preparing ?? 0}
              bg="bg-purple-50 dark:bg-purple-950/30"
            />
            <StatCard
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              label="Delivered"
              value={stats?.delivered ?? 0}
              bg="bg-green-50 dark:bg-green-950/30"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
              label="Today's Revenue"
              value={`৳${(stats?.todayRevenue ?? 0).toLocaleString()}`}
              bg="bg-orange-50 dark:bg-orange-950/30"
            />
          </>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number or customer..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {total} orders
            </p>
          )}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "all" ? "All Status" : statusConfig[s]?.label ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(LIMIT)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {searchQuery || statusFilter !== "all"
                        ? "কোনো order পাওয়া যায়নি"
                        : "এখনো কোনো order নেই"}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.provider?.restaurantName}</TableCell>
                      <TableCell className="font-medium">৳{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[order.status]?.className} border`}>
                          {statusConfig[order.status]?.label ?? order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelClick(order)}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                {pageNumbers.map((item, idx) =>
                  item === "..." ? (
                    <span key={`dot-${idx}`} className="px-2 text-sm text-muted-foreground">...</span>
                  ) : (
                    <Button
                      key={item}
                      variant={currentPage === item ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(item as number)}
                    >
                      {item}
                    </Button>
                  )
                )}
                <Button
                  variant="outline" size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString("en-BD")}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge className={`${statusConfig[selectedOrder.status]?.className} border`}>
                  {statusConfig[selectedOrder.status]?.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedOrder.provider?.restaurantName}
                </span>
              </div>

              {/* Customer Info */}
              <div className="rounded-xl border p-3 space-y-1">
                <p className="text-sm font-semibold">Customer Info</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && (
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                )}
                <p className="text-sm text-muted-foreground">{selectedOrder.deliveryAddress}, {selectedOrder.deliveryArea}</p>
              </div>

              {/* Order Items */}
              <div className="rounded-xl border p-3 space-y-2">
                <p className="text-sm font-semibold">Items</p>
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.mealName} × {item.quantity}
                    </span>
                    <span className="font-medium">৳{item.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="rounded-xl border p-3 space-y-1.5">
                <p className="text-sm font-semibold">Price Breakdown</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>৳{selectedOrder.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1.5">
                  <span>Total</span>
                  <span>৳{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl border p-3 space-y-2">
                <p className="text-sm font-semibold">Order Timeline</p>
                {[
                  { label: "Placed", time: selectedOrder.placedAt },
                  { label: "Preparing", time: selectedOrder.preparingAt },
                  { label: "Ready", time: selectedOrder.readyAt },
                  { label: "Delivered", time: selectedOrder.deliveredAt },
                  { label: "Cancelled", time: selectedOrder.cancelledAt },
                ]
                  .filter((t) => t.time)
                  .map((t) => (
                    <div key={t.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.label}</span>
                      <span>{new Date(t.time!).toLocaleString("en-BD")}</span>
                    </div>
                  ))}
              </div>

              {/* Cancel reason */}
              {selectedOrder.cancellationReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-3">
                  <p className="text-sm font-semibold text-red-700">Cancellation Reason</p>
                  <p className="text-sm text-red-600 mt-1">{selectedOrder.cancellationReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">#{cancelOrder?.orderNumber}</span> order টা cancel করতে চাও?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1 pb-2">
            <Input
              placeholder="Cancellation reason (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Stats Card Component
function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bg: string;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${bg}`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}