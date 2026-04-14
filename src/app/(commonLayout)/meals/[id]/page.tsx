"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  Heart,
  ChevronLeft,
  Minus,
  Plus,
  Truck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { mealsService } from "@/services/meals.service";
import { useCartStore } from "@/stores/cartStore";
import { MealDetails } from "@/types";

export default function MealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // ✅ Cart Store থেকে addItem ফাংশন নিন
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      const data = await mealsService.fetchMealById(id as string);
      if (data) {
        setMeal(data);
      } else {
        setError("Meal not found");
      }
      setLoading(false);
    };
    fetchMeal();
  }, [id]);

  // ✅ Add to Cart হ্যান্ডলার
  const handleAddToCart = async () => {
    if (!meal) return;

    const finalPrice = meal.discountPrice ?? meal.price;

    await addItem({
      id: meal.id,
      mealId: meal.id,
      name: meal.name,
      price: finalPrice,
      quantity: quantity,
      thumbnail: meal.thumbnail || meal.images?.[0],
      providerId: meal.provider?.id,
      providerName: meal.provider?.restaurantName,
    });

    toast.success(`${quantity} × ${meal.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error || "Meal not found"}</h1>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const finalPrice = meal.discountPrice ?? meal.price;
  const originalPrice = meal.discountPrice ? meal.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={meal.thumbnail || "/placeholder-food.jpg"}
              alt={meal.name}
              fill
              className="object-cover"
              priority
            />
            {discountPercent > 0 && (
              <Badge className="absolute left-3 top-3 bg-red-500 text-white">
                -{discountPercent}%
              </Badge>
            )}
            {meal.isVegetarian && (
              <Badge className="absolute right-3 top-3 bg-green-500 text-white">
                Vegetarian
              </Badge>
            )}
          </div>
          {meal.images && meal.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {meal.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx
                      ? "border-orange-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${meal.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Meal Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{meal.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Link href={`/providers/${meal.provider.id}`}>
                <span className="text-sm text-orange-500 hover:underline">
                  {meal.provider.restaurantName}
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{meal.rating?.toFixed(1) ?? "New"}</span>
                <span className="text-xs text-gray-500">({meal.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400">{meal.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            {originalPrice && (
              <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
            )}
            <span className="text-3xl font-bold text-orange-600">₹{finalPrice}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {meal.isSpicy && <Badge variant="outline">🌶️ Spicy</Badge>}
            {!meal.isAvailable && <Badge variant="destructive">Currently Unavailable</Badge>}
            {meal.preparationTime && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {meal.preparationTime} min
              </Badge>
            )}
            {meal.calories && <Badge variant="outline">🔥 {meal.calories} cal</Badge>}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleAddToCart}
            disabled={!meal.isAvailable}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {meal.isAvailable ? `Add to Cart · ₹${finalPrice * quantity}` : "Out of Stock"}
          </Button>

          {/* Restaurant Info */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-semibold">Restaurant Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{meal.provider.address || `${meal.provider.area}, ${meal.provider.city}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span>Delivery Fee: ₹{meal.provider.deliveryFee || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span>Min Order: ₹{meal.provider.minOrderAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Reviews Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-4">
            <div className="rounded-lg border p-4">
              <ul className="list-inside list-disc space-y-1">
                {meal.ingredients?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {meal.reviews?.length === 0 ? (
                <p className="text-center text-gray-500">No reviews yet.</p>
              ) : (
                meal.reviews?.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.customerName}</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}