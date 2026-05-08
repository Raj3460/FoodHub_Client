// components/checkout/CheckoutSummary.tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Clock } from "lucide-react";
import { CartItem } from "@/stores/cartStore";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
  isLoading: boolean;
  onSubmit: () => void;
}

export function CheckoutSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  totalItems,
  isLoading,
  onSubmit,
}: CheckoutSummaryProps) {
  return (
    <Card className="sticky top-24 border-border/60 shadow-lg">
      <CardHeader className="bg-orange-500 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Items List */}
        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.mealId} className="flex gap-3 text-sm border-b border-border/40 pb-2 last:border-0">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg font-bold text-gray-400">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">৳{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span className="font-medium">৳{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium">{deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}</span>
          </div>
          {deliveryFee > 0 && subtotal < 500 && (
            <div className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg">
              <Clock className="h-3 w-3" />
              <span>Add ৳{500 - subtotal} more for free delivery!</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-orange-500">৳{total}</span>
        </div>

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Placing Order...
            </span>
          ) : (
            `Place Order · ৳${total}`
          )}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          <span>By placing this order, you agree to our Terms of Service</span>
        </div>
      </CardContent>
    </Card>
  );
}