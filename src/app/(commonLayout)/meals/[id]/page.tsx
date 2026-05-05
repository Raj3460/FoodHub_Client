"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Clock, MapPin, ShoppingCart,
  ChevronLeft, Minus, Plus, Truck, Award, Flame,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mealsService } from "@/services/meals.service";
import { useCartStore } from "@/stores/cartStore";
import { authClient } from "@/lib/auth-client";
import { MealDetails } from "@/types";

export default function MealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      const data = await mealsService.fetchMealById(id as string);
      if (data) setMeal(data);
      else setError("Meal not found");
      setLoading(false);
    };
    fetchMeal();
  }, [id]);

  const handleAddToCart = () => {
    if (!meal) return;

    // ✅ Login check
    if (!session?.user) {
      toast.error("Please login to add items to cart", {
        duration: 3000,
        action: {
          label: "Login →",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    addItem({
      id: meal.id,
      mealId: meal.id,
      name: meal.name,
      price: meal.discountPrice ?? meal.price,
      quantity,
      thumbnail: meal.thumbnail || meal.images?.[0] || "",
      providerId: meal.provider?.id,
      providerName: meal.provider?.restaurantName || "",
    });
    toast.success(`${quantity} × ${meal.name} added to cart!`, { duration: 2000 });
  };

  // Skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-4 w-20 rounded-full bg-muted animate-pulse mb-6" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-7 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-8 w-1/4 rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-4xl mb-3">🍽️</p>
        <h1 className="text-xl font-semibold text-foreground">{error || "Meal not found"}</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const finalPrice = meal.discountPrice ?? meal.price;
  const originalPrice = meal.discountPrice ? meal.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  const displayImages = meal.images?.length
    ? meal.images
    : meal.thumbnail
    ? [meal.thumbnail]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to meals
      </button>

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Left — Image */}
        <div className="space-y-3">

          {/* Main image — aspect-video (16:9) instead of square */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-muted" style={{ aspectRatio: "4/3" }}>
            {displayImages[selectedImage] || meal.thumbnail ? (
              <img
                src={ meal.thumbnail || ""}
                alt={meal.name}
                // fill
                className="object-cover"
                // priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
            )}

            {/* Badges top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {discountPercent}% off
                </span>
              )}
              {meal.isSpicy && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  🌶 Spicy
                </span>
              )}
              {meal.isVegetarian && (
                <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  🥗 Veg
                </span>
              )}
            </div>

            {/* Rating top right */}
            {meal.rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                {meal.rating.toFixed(1)}
              </div>
            )}

            {/* Unavailable overlay */}
            {!meal.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail row — smaller */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === idx
                      ? "border-orange-500"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`img-${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Info */}
        <div className="flex flex-col gap-5">

          {/* Name + provider + rating */}
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{meal.name}</h1>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <Link
                href={`/providers/${meal.provider?.id}`}
                className="text-sm text-orange-500 hover:underline"
              >
                {meal.provider?.restaurantName || "View Restaurant"}
              </Link>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                <span>{meal.rating > 0 ? meal.rating.toFixed(1) : "New"}</span>
                {meal.totalReviews > 0 && (
                  <span>· {meal.totalReviews} reviews</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {meal.description}
          </p>

          {/* Info chips */}
          <div className="flex flex-wrap gap-2">
            {meal.preparationTime && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                <Clock className="w-3 h-3" /> {meal.preparationTime} min
              </span>
            )}
            {meal.calories && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                <Flame className="w-3 h-3 text-orange-400" /> {meal.calories} cal
              </span>
            )}
            {meal.category?.name && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                {meal.category.name}
              </span>
            )}
            {meal.totalOrders > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                🛒 {meal.totalOrders} orders
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">৳{finalPrice}</span>
            {originalPrice && (
              <span className="text-base text-muted-foreground line-through">৳{originalPrice}</span>
            )}
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-semibold text-foreground text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!meal.isAvailable}
              className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {meal.isAvailable
                ? `Add to Cart · ৳${finalPrice * quantity}`
                : "Out of Stock"}
            </button>
          </div>

          {/* Restaurant info */}
          <div className="rounded-2xl border border-border p-4 space-y-2.5 bg-muted/30">
            <p className="text-sm font-semibold text-foreground">Restaurant Info</p>
            {(meal.provider?.area || meal.provider?.city) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                {meal.provider?.address ||
                  [meal.provider?.area, meal.provider?.city].filter(Boolean).join(", ")}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              Delivery fee: ৳{meal.provider?.deliveryFee ?? 0}
            </div>
            {meal.provider?.minOrderAmount && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                Min order: ৳{meal.provider.minOrderAmount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <Tabs defaultValue="ingredients">
          <TabsList className="rounded-full border border-border bg-transparent p-1 h-auto">
            <TabsTrigger
              value="ingredients"
              className="rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white px-5 py-1.5 text-sm transition-all"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-full data-[state=active]:bg-orange-500 data-[state=active]:text-white px-5 py-1.5 text-sm transition-all"
            >
              Reviews {meal.totalReviews > 0 && `(${meal.totalReviews})`}
            </TabsTrigger>
          </TabsList>

          {/* Ingredients */}
          <TabsContent value="ingredients" className="mt-5">
            {meal.ingredients?.length ? (
              <div className="flex flex-wrap gap-2">
                {meal.ingredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredients listed.</p>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-5">
            {!meal.reviews?.length ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">⭐</p>
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meal.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-sm font-semibold text-orange-600">
                          {review.customerName?.charAt(0) ?? "U"}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {review.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                        <span className="text-sm font-medium">{review.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}