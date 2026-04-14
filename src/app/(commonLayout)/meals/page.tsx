

"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mealsService } from "@/services/meals.service";
// import { categoryService } from "@/services/category.service";
// import { FilterSidebar } from "@/components/meals/FilterSidebar";
import { MealCard } from "@/components/meals/MealCard";
import { MealCardSkeleton } from "@/components/meals/MealCardSkeleton";
import { FilterSidebar } from "@/components/meals/MealFilters";
import { CategoryService } from "@/services/category.service";
import { Meal } from "@/types/meals.types";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [ratingFilter, setRatingFilter] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    CategoryService.getCategories().then(setCategories);
  }, []);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const filters: Record<string, any> = {};
    if (search) filters.search = search;
    if (selectedCategory !== "all") filters.categoryId = selectedCategory;
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;
    if (ratingFilter) filters.minRating = 4;
    if (sortBy !== "newest") filters.sort = sortBy;
    const data = await mealsService.fetchAllMeals(filters);
    setMeals(data);
    setLoading(false);
  }, [search, selectedCategory, priceRange, ratingFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => fetchMeals(), 400);
    return () => clearTimeout(timer);
  }, [fetchMeals]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: null, max: null });
    setRatingFilter(false);
    setSearch("");
    setSortBy("newest");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">All Meals</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
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
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="mt-6">
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceChange={(min, max) => setPriceRange({ min, max })}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                  onClear={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={(min, max) => setPriceRange({ min, max })}
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            onClear={clearFilters}
          />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MealCardSkeleton key={i} />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No meals found.</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
