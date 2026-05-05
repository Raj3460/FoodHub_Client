"use client";

import { featuredProviderService } from "@/services/providers.service";
import { Provider } from "@/types/providers.types";
import { useEffect, useState } from "react";
import { Star, Clock3, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FeaturedProvidersSection() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await featuredProviderService.getAllProvidersWhereFeaturedIsTrue();
        setProviders(data || []);
      } catch (error) {
        setError("Could not load featured restaurants.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            All restaurants
          </h2>
           <Link
            href="/meals"
            className="sm:text-xl sm:font-bold text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            See all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Loading skeleton */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-border bg-card">
                <div className="h-44 bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}

          {/* Error */}
          {error && (
            <div className="col-span-4 text-center text-sm text-destructive py-8">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && providers.length === 0 && (
            <div className="col-span-4 text-center text-sm text-muted-foreground py-8">
              No featured restaurants available right now.
            </div>
          )}

          {/* Cards */}
          {!loading && !error &&
            providers.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="group rounded-2xl overflow-hidden  bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 block"
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden bg-muted">
                  <img
                    src={provider.coverImage || provider.logo || "/placeholder.jpg"}
                    alt={provider.restaurantName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                  />

                  {/* Discount badge - top left */}
                  {/* <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    <span>🏷</span>
                    {provider.deliveryFee === 0 ? "Free delivery" : "10% ছাড়"}
                  </div> */}

                  {/* Closed overlay */}
                  {!provider.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">
                        Closed now
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3">

                  {/* Name + Rating */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1 flex-1">
                      {provider.restaurantName}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      <span className="text-xs font-semibold text-foreground">
                        {provider.rating?.toFixed(1) ?? "0.0"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({provider.totalReviews ?? 0})
                      </span>
                    </div>
                  </div>

                  {/* Meta row — time · fee · cuisine */}
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                    <Clock3 className="w-3 h-3" />
                    <span>
                      {provider.deliveryTimeMin ?? 30} মিনিট থেকে
                    </span>
                    <span>·</span>
                    <span>
                      {provider.deliveryFee > 0
                        ? `৳${provider.deliveryFee}`
                        : "ফ্রি"}
                    </span>
                    <span>·</span>
                    <span className="line-clamp-1">
                      {provider.cuisineType?.join(", ") || provider.area || "Local"}
                    </span>
                  </div>

                  {/* Promo text */}
                  <div className="mt-2 flex items-center gap-1 text-orange-500 text-xs font-bold">
                    <span className="text-orange-500 font-bold">🏷</span>
                    <span>
                      {provider.deliveryFee === 0
                        ? "প্রথম অর্ডারের জন্য ফ্রি"
                        : `৳${provider.minOrderAmount ?? 0} এর উপর ছাড়`}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}