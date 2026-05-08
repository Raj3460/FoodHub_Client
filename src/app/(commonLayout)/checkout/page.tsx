"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { checkoutService } from "@/services/checkout.service";
import { CheckoutSummary } from "@/components/modules/checkout/CheckoutSummary";
import { CheckoutForm } from "@/components/modules/checkout/CheckoutForm";


export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart, fetchCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    city: "Dhaka",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setFormData((prev) => ({
          ...prev,
          fullName: data.user.name || "",
          email: data.user.email || "",
           phone: (data.user as any).phone || "",
          // Phone is NOT auto-filled – user must enter it manually
        }));
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.area) {
      toast.error("Please fill all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setIsLoading(true);
    const orderData = {
      deliveryAddress: formData.address,
      deliveryArea: formData.area,
      deliveryInstructions: formData.notes || undefined,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email || undefined,
      paymentMethod,
    };

    const result = await checkoutService.placeOrder(orderData);
    if (result.success && result.data?.id) {
      toast.success("Order placed successfully!");
      await clearCart();
      router.push(`/orders/${result.data.id}`);
    } else {
      toast.error(result.message || "Failed to place order");
    }
    setIsLoading(false);
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <Truck className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Add some items to proceed to checkout.</p>
        <Button asChild className="mt-6 bg-orange-500 hover:bg-orange-600">
          <Link href="/meals">Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            formData={formData}
            onChange={handleChange}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            totalItems={totalItems}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}