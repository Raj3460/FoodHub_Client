"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock3, Flame } from "lucide-react";
import { Meal } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function MealCard({ meal }: { meal: Meal }) {
  const router = useRouter();
  const { addItem } = useCartStore();
   const { data: session } = authClient.useSession();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

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
      quantity: 1,
      thumbnail: meal.thumbnail || "",
      providerId: meal.providerId,
      providerName: meal.provider?.restaurantName || "",
    });
    toast.success(`${meal.name} added to cart!`, { duration: 2000 });
  };
  

  return (
    <article
      onClick={() => router.push(`/meals/${meal.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        {meal.thumbnail ? (
          <Image
            src={meal.thumbnail}
            alt={meal.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-muted-foreground">
            {meal.name.charAt(0)}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {meal.discountPrice && meal.discountPrice < meal.price && (
            <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {Math.round((1 - meal.discountPrice / meal.price) * 100)}% off
            </span>
          )}
          {meal.isSpicy && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              🌶 Spicy
            </span>
          )}
          {meal.isVegetarian && (
            <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              🥗 Veg
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
          {meal.rating > 0 ? meal.rating.toFixed(1) : "New"}
        </div>

        {/* Unavailable overlay */}
        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground line-clamp-1">
          {meal.name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="w-3 h-3" />
          <span>{meal.preparationTime ?? 30} min</span>
          <span>·</span>
          <span>{meal.category?.name || "Food"}</span>
          {meal.calories && (
            <>
              <span>·</span>
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{meal.calories} cal</span>
            </>
          )}
        </div>

        {meal.provider?.restaurantName && (
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
            {meal.provider.restaurantName}
          </p>
        )}

        {/* Price + Add */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-foreground">
              ৳{meal.discountPrice ?? meal.price}
            </span>
            {meal.discountPrice && meal.discountPrice < meal.price && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{meal.price}
              </span>
            )}
          </div>
          <button
            disabled={!meal.isAvailable}
            onClick={handleAddToCart}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  );
}