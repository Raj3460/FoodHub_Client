"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Utensils,
  ShoppingBag,
  User,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

// FAQ ডাটা (প্রোভাইডারদের জন্য)
const faqs = [
  {
    question: "কিভাবে নতুন মেনু আইটেম যোগ করব?",
    answer:
      "Menu পেজে যান, 'Add Meal' বাটনে ক্লিক করুন, খাবারের নাম, দাম, ছবি ইত্যাদি দিয়ে সাবমিট করুন।",
    category: "menu",
  },
  {
    question: "অর্ডারের স্ট্যাটাস কিভাবে আপডেট করব?",
    answer:
      "Orders পেজে যান, যেই অর্ডারের স্ট্যাটাস পরিবর্তন করতে চান, তার পাশের ড্রপডাউন থেকে স্ট্যাটাস সিলেক্ট করুন (Preparing, Ready, Delivered)।",
    category: "orders",
  },
  {
    question: "আমার রেস্টুরেন্টের তথ্য কিভাবে আপডেট করব?",
    answer:
      "Profile পেজে গিয়ে আপনার রেস্টুরেন্টের নাম, ঠিকানা, ফোন নম্বর, খোলা-বন্ধের সময় ইত্যাদি আপডেট করতে পারেন।",
    category: "profile",
  },
  {
    question: "ডেলিভারি ফি ও মিনিমাম অর্ডার কিভাবে সেট করব?",
    answer:
      "Profile পেজের 'Delivery Settings' সেকশনে গিয়ে ডেলিভারি ফি ও মিনিমাম অর্ডার অ্যামাউন্ট সেট করতে পারেন।",
    category: "profile",
  },
  {
    question: "কিভাবে দেখব আমার রেস্টুরেন্টের রেটিং ও রিভিউ?",
    answer:
      "Dashboard এ স্ট্যাটস কার্ডে গড় রেটিং দেখতে পাবেন। বিস্তারিত রিভিউ দেখতে রিভিউ সেকশন চেক করুন (যদি যোগ করেন)।",
    category: "dashboard",
  },
  {
    question: "কিভাবে অর্ডার হিস্টোরি দেখব?",
    answer:
      "Orders পেজে সব অর্ডার লিস্ট পাবেন, সেখানে স্ট্যাটাস ও তারিখ অনুযায়ী ফিল্টার করতে পারবেন।",
    category: "orders",
  },
];

// দ্রুত লিংক
const quickLinks = [
  { title: "Menu Management", href: "/provider/menu", icon: Utensils, color: "text-orange-500" },
  { title: "Orders", href: "/provider/orders", icon: ShoppingBag, color: "text-blue-500" },
  { title: "Profile", href: "/provider/profile", icon: User, color: "text-green-500" },
];

// সাপোর্ট কন্ট্যাক্ট
const supportContacts = [
  { type: "Email", value: "provider-support@foodhub.com", icon: Mail, action: "mailto:provider-support@foodhub.com" },
  { type: "Phone", value: "+880 1234 567890", icon: Phone, action: "tel:+8801234567890" },
  { type: "Live Chat", value: "Start a conversation", icon: MessageCircle, action: "#" },
];

export default function ProviderHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Get help with managing your restaurant on FoodHub
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="quick-links">Quick Links</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about managing your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No FAQs found matching "{searchQuery}"
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <Badge variant="outline" className="mt-2">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Links Tab */}
        <TabsContent value="quick-links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Quick Navigation
              </CardTitle>
              <CardDescription>
                Jump directly to any management page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Card className="transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
                      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                        <link.icon className={`h-8 w-8 ${link.color}`} />
                        <span className="font-medium">{link.title}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Guide for Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started as a Provider</CardTitle>
              <CardDescription>
                Follow these steps to manage your restaurant effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Complete Your Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Add your restaurant details, logo, opening hours, delivery fee, etc.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Add Menu Items</p>
                    <p className="text-sm text-muted-foreground">
                      Upload your food items with images, prices, and descriptions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Manage Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor incoming orders and update their status (Preparing, Ready, Delivered).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Track Performance</p>
                    <p className="text-sm text-muted-foreground">
                      Check your dashboard for total orders, pending orders, and average rating.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {supportContacts.map((contact) => (
                  <a
                    key={contact.type}
                    href={contact.action}
                    className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-all hover:shadow-md"
                  >
                    <contact.icon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{contact.type}</p>
                      <p className="text-sm text-muted-foreground">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>API Server</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order Processing</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Gateway</span>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    Cash on Delivery Only
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}