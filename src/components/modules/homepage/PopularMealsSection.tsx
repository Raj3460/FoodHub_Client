"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mealsService } from "@/services/meals.service";
import { Meal } from "@/types/meals.types";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MealCard } from "@/components/meals/MealCard";

export default function PopularMealsSection() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await mealsService.fetchPopularMeals(8);
        setMeals(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load popular meals.");
      } finally {
        setLoading(false);
      }
    };
    loadMeals();
  }, []);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "right" ? 560 : -560, behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Popular meals
          </h2>
          <div className="flex items-center gap-3">
            {/* Scroll Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/meals"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scroll container — no scrollbar */}
        <div className="relative">
          {/* Left fade */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          )}
          {/* Right fade */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Skeleton loading */}
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[260px] flex-shrink-0 animate-pulse rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <div className="h-44 bg-muted" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-8 w-full rounded-full bg-muted mt-3" />
                  </div>
                </div>
              ))}

            {/* Error */}
            {error && (
              <div className="w-full text-center text-sm text-destructive py-8">
                {error}
              </div>
            )}

            {/* Meal Cards */}
            {!loading &&
              !error &&
              meals.map((meal) => (
                <div key={meal.id} className="w-[260px] flex-shrink-0">
                  <MealCard meal={meal} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}