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
      {/* Category Filter - Combobox + List */}
      <div>
        <h3 className="mb-3 font-semibold">Category</h3>

        {/* Combobox for search */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mb-4"
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
                    onSelect={() => {
                      onCategoryChange("all");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Categories
                  </CommandItem>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.name}
                      onSelect={() => {
                        onCategoryChange(cat.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory === cat.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {cat.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Radio List with Show More/Less */}
        <div className="space-y-2 mt-2">
          {/* All option always visible */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "all"}
              onChange={() => onCategoryChange("all")}
              className="accent-orange-500"
            />
            All
          </label>

          {/* Visible categories */}
          {visibleCategories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => onCategoryChange(cat.id)}
                className="accent-orange-500"
              />
              {cat.name}
            </label>
          ))}

          {/* Show More / Show Less Button */}
          {hasMoreCategories && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 mt-2"
            >
              {showAllCategories ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show More ({categories.length - INITIAL_VISIBLE} more)
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold">Price Range</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min ?? ""}
            onChange={(e) =>
              onPriceChange(e.target.value ? Number(e.target.value) : null, priceRange.max)
            }
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max ?? ""}
            onChange={(e) =>
              onPriceChange(priceRange.min, e.target.value ? Number(e.target.value) : null)
            }
            className="w-24"
          />
        </div>
      </div>

      {/* Rating 4+ Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={ratingFilter}
            onCheckedChange={(checked) => onRatingChange(!!checked)}
          />
          Only show meals with rating ≥ 4
        </label>
      </div>

      {/* Clear Filters Button */}
      <Button variant="outline" onClick={onClear} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}