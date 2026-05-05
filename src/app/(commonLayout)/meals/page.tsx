"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { mealsService } from "@/services/meals.service";
import { MealCard } from "@/components/meals/MealCard";
import { MealCardSkeleton } from "@/components/meals/MealCardSkeleton";
import { FilterSidebar } from "@/components/meals/MealFilters";
import { CategoryService } from "@/services/category.service";
import { Meal } from "@/types/meals.types";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [ratingFilter, setRatingFilter] = useState(false);
  const [vegetarianFilter, setVegetarianFilter] = useState(false);
  const [spicyFilter, setSpicyFilter] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    CategoryService.getCategories().then(setCategories);
  }, []);

  const fetchMeals = useCallback(async () => {
    if (meals.length === 0) {
      setLoading(true);
    } else {
      setSearching(true);
    }

    const filters: Record<string, any> = {};
    if (search) filters.search = search;
    if (selectedCategory !== "all") filters.categoryId = selectedCategory;
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;
    if (ratingFilter) filters.minRating = 4;
    if (vegetarianFilter) filters.isVegetarian = true;
    if (spicyFilter) filters.isSpicy = true;
    if (sortBy !== "newest") filters.sort = sortBy;

    const data = await mealsService.fetchAllMeals(filters);
    setMeals(data ?? []);
    setLoading(false);
    setSearching(false);
  }, [search, selectedCategory, priceRange, ratingFilter, vegetarianFilter, spicyFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => fetchMeals(), 400);
    return () => clearTimeout(timer);
  }, [fetchMeals]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: null, max: null });
    setRatingFilter(false);
    setVegetarianFilter(false);
    setSpicyFilter(false);
    setSearch("");
    setSortBy("newest");
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Sticky Header Section */}
      <div className="sticky top-16 z-30 bg-background pb-4 mb-4 border-b border-border/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="md:text-2xl sm:text-xl font-bold  text-foreground">All Meals</h1>
            {!loading && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {meals.length} meals found
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search meals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                {/* ✅ Accessibility fix – required for screen readers */}
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="mt-6">
                  <FilterSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    priceRange={priceRange}
                    onPriceChange={(min: number | null, max: number | null) => setPriceRange({ min, max })}
                    ratingFilter={ratingFilter}
                    onRatingChange={setRatingFilter}
                    vegetarianFilter={vegetarianFilter}
                    onVegetarianChange={setVegetarianFilter}
                    spicyFilter={spicyFilter}
                    onSpicyChange={setSpicyFilter}
                    onClear={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-8">

        {/* Desktop sidebar – now sticky */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={(min: number | null, max: number | null) => setPriceRange({ min, max })}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
              vegetarianFilter={vegetarianFilter}
              onVegetarianChange={setVegetarianFilter}
              spicyFilter={spicyFilter}
              onSpicyChange={setSpicyFilter}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0 relative">

          {/* Progress bar */}
          {searching && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-200 rounded-full overflow-hidden z-10">
              <div className="h-full w-1/3 bg-orange-500 rounded-full animate-[slide_1s_ease-in-out_infinite]" />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MealCardSkeleton key={i} />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-lg font-semibold text-foreground">No meals found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ${
                searching
                  ? "opacity-40 scale-[0.99] pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
            >
              {meals.map((meal, index) => (
                <div
                  key={meal.id}
                  style={{
                    animation: "fadeIn 0.3s ease forwards",
                    animationDelay: `${index * 30}ms`,
                    opacity: 0,
                  }}
                >
                  <MealCard meal={meal} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );  
}