"use client";

import { Gift, CalendarDays, Tag, Percent } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: string;      // e.g., "20% OFF"
  code: string;
  validUntil: string;
  minOrder: number;
  image?: string;
}

const demoVouchers: Voucher[] = [
  {
    id: "1",
    title: "Welcome Offer",
    description: "Get flat 20% off on your first order",
    discount: "20% OFF",
    code: "FOODHUB20",
    validUntil: "2026-06-30",
    minOrder: 200,
  },
  {
    id: "2",
    title: "Free Delivery",
    description: "Free delivery on orders above ₹500",
    discount: "Free Delivery",
    code: "FREEDEL",
    validUntil: "2026-05-31",
    minOrder: 500,
  },
  {
    id: "3",
    title: "Weekend Special",
    description: "Get extra 10% off on weekends",
    discount: "10% OFF",
    code: "WEEKEND10",
    validUntil: "2026-06-15",
    minOrder: 300,
  },
  {
    id: "4",
    title: "Referral Bonus",
    description: "Refer a friend and get ₹100 off",
    discount: "₹100 OFF",
    code: "REF100",
    validUntil: "2026-07-01",
    minOrder: 1,
  },
];

export default function VouchersPage() {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Offers & Vouchers</h1>
        <p className="text-muted-foreground mt-2">
          Unlock discounts and special deals for your next order
        </p>
      </div>

      {/* Vouchers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {demoVouchers.map((voucher) => (
          <Card key={voucher.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Gift className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">{voucher.title}</CardTitle>
                </div>
                <div className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {voucher.discount}
                </div>
              </div>
              <CardDescription className="mt-2">{voucher.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-medium">{voucher.code}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Valid until {new Date(voucher.validUntil).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span>Min. order ₹{voucher.minOrder}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                onClick={() => copyToClipboard(voucher.code)}
              >
                Copy Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No vouchers placeholder (if needed) */}
      {demoVouchers.length === 0 && (
        <div className="text-center py-16">
          <div className="rounded-full bg-gray-100 p-3 w-fit mx-auto dark:bg-gray-800">
            <Gift className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No active vouchers</h2>
          <p className="text-muted-foreground">Check back later for new offers!</p>
        </div>
      )}
    </div>
  );
}