"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mealsService } from "@/services/meals.service";
import { Meal } from "@/types/meals.types";
import { Button } from "@/components/ui/button";
import { Clock3, Heart, Star } from "lucide-react";

export default function PopularMealsSection() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await mealsService.fetchPopularMeals(6);
        setMeals(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load popular meals at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  return (
    <section className="bg-white py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-300">
              Popular meals
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Try the dishes customers love most.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              From local favorites to chef specials, these meals are trending right now.
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-4 md:mt-0">
            <Link href="/meals">View all meals</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.75rem] border border-border bg-slate-100 p-6 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-5 h-56 rounded-3xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-3/5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))
            : error
            ? (
                <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-sm text-destructive">
                  {error}
                </div>
              )
            : meals.map((meal) => (
                <article
                  key={meal.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={meal.thumbnail || meal.images?.[0] || "/next.svg"}
                      alt={meal.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/90 px-4 py-3 text-white">
                      <div className="text-sm font-medium">
                        {meal.category?.name || "Popular"}
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold">
                        <Star className="size-4" />
                        {meal.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {meal.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {meal.description || "Delicious meal made for your cravings."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                        <Heart className="size-4 text-rose-500" />
                        {meal.totalOrders} orders
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                        <Clock3 className="size-4 text-amber-600" />
                        {meal.preparationTime ? `${meal.preparationTime} min` : "Ready soon"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                        {meal.provider?.restaurantName || "Local kitchen"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="text-2xl font-semibold text-foreground">
                          ${meal.discountPrice ?? meal.price.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/meals/${meal.id}`}
                        className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted dark:bg-slate-900 dark:hover:bg-slate-800"
                      >
                        Order now
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
