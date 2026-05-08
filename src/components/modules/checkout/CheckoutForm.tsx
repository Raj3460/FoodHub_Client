// components/checkout/CheckoutForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, CreditCard, Smartphone, Truck } from "lucide-react";

interface CheckoutFormProps {
  formData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    area: string;
    city: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

export function CheckoutForm({
  formData,
  onChange,
  paymentMethod,
  onPaymentMethodChange,
}: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      {/* Delivery Information */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-orange-500" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={onChange}
                required
                className="focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                Phone Number *
                <span className="text-xs text-orange-500">(required for delivery)</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="017XXXXXXXX"
                value={formData.phone}
                onChange={onChange}
                required
                className="focus:ring-orange-500 focus:border-orange-500 border-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              className="focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Input
              id="address"
              name="address"
              placeholder="House #, Road, Area"
              value={formData.address}
              onChange={onChange}
              required
              className="focus:ring-orange-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Area / Thana *</Label>
              <Input
                id="area"
                name="area"
                placeholder="Dhanmondi, Gulshan, etc."
                value={formData.area}
                onChange={onChange}
                required
                className="focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={onChange}
                className="focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Gate code, landmark, etc."
              value={formData.notes}
              onChange={onChange}
              rows={2}
              className="focus:ring-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="space-y-3">
            {/* Cash on Delivery */}
            <div className="flex items-center gap-3 rounded-lg border-2 p-4 hover:border-orange-300 transition-all cursor-pointer">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
              </Label>
            </div>

            {/* bKash (disabled) */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 opacity-60 cursor-not-allowed">
              <RadioGroupItem value="bkash" id="bkash" disabled />
              <Label htmlFor="bkash" className="flex flex-1 items-center justify-between cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">bKash</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Coming soon</span>
                </div>
              </Label>
            </div>

            {/* Nagad (disabled) */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 opacity-60 cursor-not-allowed">
              <RadioGroupItem value="nagad" id="nagad" disabled />
              <Label htmlFor="nagad" className="flex flex-1 items-center justify-between cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Nagad</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Coming soon</span>
                </div>
              </Label>
            </div>

            {/* Rocket (disabled) */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 opacity-60 cursor-not-allowed">
              <RadioGroupItem value="rocket" id="rocket" disabled />
              <Label htmlFor="rocket" className="flex flex-1 items-center justify-between cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Rocket</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Coming soon</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}