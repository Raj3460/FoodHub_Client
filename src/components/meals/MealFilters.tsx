"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  priceRange: { min: number | null; max: number | null };
  onPriceChange: (min: number | null, max: number | null) => void;
  ratingFilter: boolean;
  onRatingChange: (checked: boolean) => void;
  vegetarianFilter: boolean;
  onVegetarianChange: (checked: boolean) => void;
  spicyFilter: boolean;
  onSpicyChange: (checked: boolean) => void;
  onClear: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  vegetarianFilter,
  onVegetarianChange,
  spicyFilter,
  onSpicyChange,
  onClear,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const INITIAL_VISIBLE = 10;
  const hasMoreCategories = categories.length > INITIAL_VISIBLE;
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_VISIBLE);

  const selectedCat = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-6">

      {/* Category */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </p>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between rounded-full mb-4"
            >
              {selectedCategory === "all"
                ? "All Categories"
                : selectedCat?.name || "Select category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => { onCategoryChange("all"); setOpen(false); }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedCategory === "all" ? "opacity-100" : "opacity-0")} />
                    All Categories
                  </CommandItem>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.name}
                      onSelect={() => { onCategoryChange(cat.id); setOpen(false); }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedCategory === cat.id ? "opacity-100" : "opacity-0")} />
                      {cat.icon} {cat.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "all"}
              onChange={() => onCategoryChange("all")}
              className="accent-orange-500"
            />
            All
          </label>
          {visibleCategories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => onCategoryChange(cat.id)}
                className="accent-orange-500"
              />
              {cat.icon} {cat.name}
            </label>
          ))}
          {hasMoreCategories && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 mt-2"
            >
              {showAllCategories ? (
                <><ChevronUp className="h-4 w-4" />Show Less</>
              ) : (
                <><ChevronDown className="h-4 w-4" />Show More ({categories.length - INITIAL_VISIBLE} more)</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min ?? ""}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : null, priceRange.max)}
            className="h-8 rounded-full text-xs"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max ?? ""}
            onChange={(e) => onPriceChange(priceRange.min, e.target.value ? Number(e.target.value) : null)}
            className="h-8 rounded-full text-xs"
          />
        </div>
      </div>

      {/* Dietary */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Dietary
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={vegetarianFilter}
              onCheckedChange={(checked) => onVegetarianChange(!!checked)}
              className="accent-orange-500"
            />
            🥗 Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={spicyFilter}
              onCheckedChange={(checked) => onSpicyChange(!!checked)}
              className="accent-orange-500"
            />
            🌶 Spicy
          </label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rating
        </p>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={ratingFilter}
            onCheckedChange={(checked) => onRatingChange(!!checked)}
          />
          ★ 4+ stars only
        </label>
      </div>

      {/* Clear */}
      <button
        onClick={onClear}
        className="w-full rounded-full border border-border py-2 text-xs font-medium text-muted-foreground hover:border-orange-400 hover:text-orange-500 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}