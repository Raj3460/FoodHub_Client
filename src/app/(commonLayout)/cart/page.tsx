// app/(commonLayout)/cart/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getTotalItems,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, number>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = useCallback(
    (mealId: string, currentQuantity: number, delta: number) => {
      const newQuantity = currentQuantity + delta;
      if (newQuantity < 1) return;

      // Immediately show optimistic quantity in UI
      setPendingUpdates((prev) => ({ ...prev, [mealId]: newQuantity }));

      // Clear previous debounce for this item
      if (debounceTimers.current[mealId]) {
        clearTimeout(debounceTimers.current[mealId]);
      }

      // Debounce the actual API call
      debounceTimers.current[mealId] = setTimeout(async () => {
        try {
          await updateQuantity(mealId, newQuantity);
          toast.success("Quantity updated", { duration: 1500 });
        } catch (error) {
          toast.error("Failed to update quantity");
        } finally {
          setPendingUpdates((prev) => {
            const next = { ...prev };
            delete next[mealId];
            return next;
          });
        }
        delete debounceTimers.current[mealId];
      }, 300);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    async (mealId: string, name: string) => {
      try {
        await removeItem(mealId);
        toast.success(`${name} removed`);
      } catch {
        toast.error("Failed to remove item");
      }
    },
    [removeItem]
  );

  // Cleanup timers
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const totalItems = getTotalItems();

  if (!isMounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any items yet.</p>
          <Button asChild className="mt-6 bg-orange-500 hover:bg-orange-600">
            <Link href="/meals">Browse Meals</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Cart ({totalItems} items)</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const isUpdating = pendingUpdates[item.mealId] !== undefined;
              const displayQuantity = isUpdating ? pendingUpdates[item.mealId] : item.quantity;

              return (
                <div
                  key={item.mealId}
                  className="flex gap-4 rounded-lg border p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-bold text-gray-400">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/meals/${item.mealId}`}>
                          <h3 className="font-semibold hover:text-orange-500">
                            {item.name}
                          </h3>
                        </Link>
                        {item.providerName && (
                          <p className="text-xs text-gray-500">{item.providerName}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.mealId, item.name)}
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.mealId, item.quantity, -1)}
                          disabled={isUpdating}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {displayQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.mealId, item.quantity, 1)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-orange-500" />}
                      </div>
                      <p className="font-semibold">৳{item.price * displayQuantity}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
              {deliveryFee > 0 && subtotal < 500 && (
                <p className="text-xs text-gray-500">
                  Add items worth ৳{500 - subtotal} more to get free delivery!
                </p>
              )}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}