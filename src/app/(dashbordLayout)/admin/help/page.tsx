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
  BookOpen,
  FileQuestion,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
  Users,
  Store,
  ShoppingBag,
  Settings,
} from "lucide-react";
import Link from "next/link";

// FAQ Data
const faqs = [
  {
    question: "How do I add a new admin user?",
    answer:
      "Go to Users Management page, click 'Add User', fill in their details, and assign 'ADMIN' role. The user will receive an invitation email.",
    category: "users",
  },
  {
    question: "How to approve a new restaurant provider?",
    answer:
      "Navigate to Providers Management, find the pending provider, click 'Approve' button. You can also reject if documents are incomplete.",
    category: "providers",
  },
  {
    question: "How to manage orders?",
    answer:
      "Go to Orders Management page. You can view all orders, filter by status, and click on any order to see detailed information.",
    category: "orders",
  },
  {
    question: "How to add/edit food categories?",
    answer:
      "Go to Categories Management page. Click 'Add Category', enter name and slug. To edit, click the edit icon next to any category.",
    category: "categories",
  },
  {
    question: "How to view platform statistics?",
    answer:
      "The Dashboard page shows all key metrics including total users, providers, orders, and revenue. Charts show trends over time.",
    category: "dashboard",
  },
  {
    question: "How to suspend a user account?",
    answer:
      "Go to Users Management, find the user, click the actions menu (three dots), and select 'Suspend'. Suspended users cannot log in.",
    category: "users",
  },
  {
    question: "What does 'Featured' provider mean?",
    answer:
      "Featured providers appear on the homepage's 'Featured Restaurants' section. You can toggle this from Providers Management.",
    category: "providers",
  },
  {
    question: "How to check order delivery status?",
    answer:
      "Orders show status badges: Placed → Preparing → Ready → Delivered. You can track from Orders Management.",
    category: "orders",
  },
];

// Quick Links Data
const quickLinks = [
  { title: "Users Management", href: "/admin/users", icon: Users, color: "text-blue-500" },
  { title: "Providers Management", href: "/admin/providers", icon: Store, color: "text-orange-500" },
  { title: "Orders Management", href: "/admin/orders", icon: ShoppingBag, color: "text-green-500" },
  { title: "Categories Management", href: "/admin/categories", icon: Settings, color: "text-purple-500" },
];

// Support Contacts
const supportContacts = [
  { type: "Email", value: "admin@foodhub.com", icon: Mail, action: "mailto:admin@foodhub.com" },
  { type: "Phone", value: "+880 1234 567890", icon: Phone, action: "tel:+8801234567890" },
  { type: "Live Chat", value: "Start a conversation", icon: MessageCircle, action: "#" },
];

export default function AdminHelpPage() {
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
          Get help with managing your FoodHub platform
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

      {/* Main Content Tabs */}
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
                <FileQuestion className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about managing the FoodHub platform
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
                <BookOpen className="h-5 w-5" />
                Quick Navigation
              </CardTitle>
              <CardDescription>
                Jump directly to any management page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Getting Started Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started Guide</CardTitle>
              <CardDescription>
                Follow these steps to set up and manage your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Review Dashboard Stats</p>
                    <p className="text-sm text-muted-foreground">
                      Check your platform's performance metrics on the Dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Approve New Providers</p>
                    <p className="text-sm text-muted-foreground">
                      Review and approve pending restaurant applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor user activity and manage account statuses
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Track Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor all platform orders and their statuses
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
                  <span>Database</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Backup</span>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    Today, 02:00 AM
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