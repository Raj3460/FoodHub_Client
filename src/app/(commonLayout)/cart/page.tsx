"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
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
    removeItem, 
    updateQuantity, 
    getSubtotal, 
    getDeliveryFee, 
    getTotal, 
    getTotalItems 
  } = useCartStore();
  
  const [isMounted, setIsMounted] = useState(false);

  // Load cart on mount
  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const totalItems = getTotalItems();

  const handleQuantityChange = async (mealId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(mealId, newQuantity);
    toast.success("Quantity updated");
  };

  const handleRemoveItem = async (mealId: string, name: string) => {
    await removeItem(mealId);
    toast.success(`${name} removed from cart`);
  };

  // Loading state
  if (!isMounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
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
            {items.map((item) => (
              <div
                key={item.mealId}
                className="flex gap-4 rounded-lg border p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
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

                {/* Details */}
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
                        onClick={() => handleQuantityChange(item.mealId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.mealId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
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
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              {deliveryFee > 0 && subtotal < 500 && (
                <p className="text-xs text-gray-500">
                  Add items worth ₹{500 - subtotal} more to get free delivery!
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