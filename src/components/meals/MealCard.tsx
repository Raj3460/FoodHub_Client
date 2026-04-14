

"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meal } from "@/types";


export function MealCard({ meal }: { meal: Meal }) {
  const finalPrice = meal.discountPrice ?? meal.price;
  const originalPrice = meal.discountPrice ? meal.price : null;

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <button className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm">
        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
      </button>

      {meal.id ? (
        <Link href={`/meals/${meal.id}`}>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {meal.thumbnail ? (
              <Image src={meal.thumbnail} alt={meal.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-bold text-gray-400">
                {meal.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          {meal.thumbnail ? (
            <Image src={meal.thumbnail} alt={meal.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-bold text-gray-400">
              {meal.name.charAt(0)}
            </div>
          )}
        </div>
      )}

      <div className="mt-3">
        {meal.id ? (
          <Link href={`/meals/${meal.id}`}>
            <h3 className="font-semibold line-clamp-1 hover:text-orange-600">{meal.name}</h3>
          </Link>
        ) : (
          <h3 className="font-semibold line-clamp-1 text-foreground">{meal.name}</h3>
        )}
        <p className="text-xs text-gray-500">{meal.provider?.restaurantName || "Restaurant"}</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            {originalPrice && <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>}
            <span className="ml-1 text-lg font-bold text-orange-600">₹{finalPrice}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{meal.rating?.toFixed(1) ?? "New"}</span>
          </div>
        </div>
        <Button size="sm" className="mt-2 w-full bg-orange-500 hover:bg-orange-600">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}