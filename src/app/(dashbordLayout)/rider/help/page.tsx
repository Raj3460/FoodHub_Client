"use client";

// src/app/(dashboardLayout)/rider/help/page.tsx

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "What should I do if Admin doesn't approve me?",
    a: "After signing up, Admin reviews your Account. It usually takes 24-48 hours to get approved. If it takes longer, please contact support.",
  },
  {
    q: "What should I do after accepting an Order?",
    a: "Pick up the food from the Restaurant, then mark 'Picked Up' from the Dashboard. After delivering to the Customer, mark as 'Delivered'.",
  },
  {
    q: "How do I get paid?",
    a: "You will receive a Delivery Fee for each Delivery. For Cash on Delivery, you will receive it directly in hand. Your Total Earnings can be seen on the Dashboard.",
  },
  {
    q: "What is the Online/Offline Status for?",
    a: "When Online, you can see and accept new Orders. When Offline, no new Orders will come to you.",
  },
  {
    q: "How many Orders can I take at once?",
    a: "You can only take one Order at a time. You cannot accept a new Order until your current Delivery is finished.",
  },
  {
    q: "What should I do if my Account is Suspended?",
    a: "If Suspended, the reason will be shown on the Dashboard. For more details or to appeal, contact us at the number below.",
  },
];

export default function RiderHelp() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Help & Support</h1>
        <p className="text-sm text-gray-500">
          Find common questions and solutions, or contact us directly.
        </p>
      </div>

      {/* Contact Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-medium text-gray-800">Need urgent help?</p>
            <p className="text-sm text-gray-500">
              Speak directly with our support team
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-orange-300"
              onClick={() => (window.location.href = "tel:+8801700000000")}
            >
              📞 Call
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() =>
                (window.location.href = "https://wa.me/8801700000000")
              }
            >
              💬 WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <div>
        <h2 className="text-base font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <Card key={i} className="cursor-pointer">
              <CardHeader
                className="py-3"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {item.q}
                  </CardTitle>
                  <span className="text-gray-400">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </div>
              </CardHeader>
              {openIndex === i && (
                <CardContent className="pt-0 pb-3 text-sm text-gray-600">
                  {item.a}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Email */}
      <div className="text-center text-sm text-gray-400 pt-2">
        Or email us:{" "}
        <a href="mailto:support@foodghor.com" className="text-orange-500 underline">
          support@foodghor.com
        </a>
      </div>
    </div>
  );
}