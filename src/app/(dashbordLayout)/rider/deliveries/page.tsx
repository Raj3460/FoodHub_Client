"use client";

// src/app/(dashboardLayout)/rider/deliveries/page.tsx

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  getDeliveryHistory,
  type DeliveryHistory,
} from "@/services/riderDashboardService";
import DeliveryCard from "./_components/delivaryCard";



export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState<DeliveryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDeliveryHistory(page, 10);
        setDeliveries(res.data);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        toast.error(err.message || "Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  if (loading) {
    return (
      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">My Deliveries</h1>

      {deliveries.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
          <div className="text-5xl">📦</div>
          <p className="text-gray-500">No deliveries yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {deliveries.map((d) => (
              <DeliveryCard key={d.id} delivery={d} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}