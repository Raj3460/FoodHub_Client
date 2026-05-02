"use client";

import { useState } from "react";
import { Search, Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// FAQ data
const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse meals, add items to your cart, then go to checkout. Enter your delivery address and confirm your order. You'll receive updates via email and SMS.",
    category: "ordering",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We currently accept Cash on Delivery (COD). Online payment will be available soon.",
    category: "payments",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel an order while it's still in 'Placed' status. Go to My Orders → Order Details → Cancel Order.",
    category: "ordering",
  },
  {
    question: "How do I become a restaurant provider?",
    answer:
      "Register as a Provider, fill in your restaurant details, and wait for admin approval. Once approved, you can add your menu and manage orders.",
    category: "provider",
  },
  {
    question: "How is delivery fee calculated?",
    answer:
      "Delivery fee depends on your location and restaurant policy. It's shown during checkout before you place the order.",
    category: "delivery",
  },
  {
    question: "I didn't receive my order. What should I do?",
    answer: "Please contact the restaurant directly or reach out to our support team at support@foodhub.com.",
    category: "delivery",
  },
  {
    question: "How do I leave a review?",
    answer:
      "After your order is delivered, go to that order in My Orders and click 'Leave Review'. You can rate and comment on each meal.",
    category: "reviews",
  },
  {
    question: "Why was my account suspended?",
    answer:
      "Account suspension may happen due to multiple policy violations. Contact admin@foodhub.com for details.",
    category: "account",
  },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Ordering", value: "ordering" },
  { label: "Payments", value: "payments" },
  { label: "Delivery", value: "delivery" },
  { label: "Provider", value: "provider" },
  { label: "Account", value: "account" },
  { label: "Reviews", value: "reviews" },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    // Here you would normally send the message to an API endpoint.
    // For now, we just show a success toast.
    console.log({ name, email, message });
    toast.success("Message sent! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-6 text-base rounded-full shadow-sm"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.value)}
                className="rounded-full px-4 py-1 h-9"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* FAQ Accordion */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No results found</h3>
              <p className="text-muted-foreground">
                Try different keywords or browse categories.
              </p>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contact Us Tab */}
        <TabsContent value="contact">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Support
                  </CardTitle>
                  <CardDescription>
                    Send us an email and we'll reply within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:support@foodhub.com"
                    className="text-primary hover:underline"
                  >
                    support@foodhub.com
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>
                    Speak directly with our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">+880 1234 567890</p>
                  <p className="text-sm text-muted-foreground">
                    Mon – Fri, 9 AM – 6 PM (Bangladesh Time)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Live Chat
                  </CardTitle>
                  <CardDescription>
                    Chat with our support agents instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Chat feature coming soon!")}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="How can we help you?"
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}