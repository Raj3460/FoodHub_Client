"use client";

import { featuredProviderService } from "@/services/providers.service";
import { Provider } from "@/types/providers.types";
import { useEffect, useState } from "react";
import { Clock3, MapPin, Star } from "lucide-react";

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
    <section className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
              Featured restaurants
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Discover top local kitchens curated for you.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Explore highly-rated and trending providers with fast delivery and rich menu selections.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-4 h-44 rounded-3xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))
            : error
            ? (
                <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-sm text-destructive">
                  {error}
                </div>
              )
            : providers.length === 0
            ? (
                <div className="rounded-3xl border border-border bg-white p-8 text-center text-sm text-muted-foreground shadow-sm dark:bg-slate-900">
                  No featured restaurants available right now.
                </div>
              )
            : providers.map((provider) => (
                <article
                  key={provider.id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative mb-6 h-56 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={provider.coverImage || provider.logo || "/next.svg"}
                      alt={provider.restaurantName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/70 px-4 py-3 text-white">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium">
                        {provider.isOpen ? "Open now" : "Closed"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        <Star className="size-3" />
                        {provider.rating?.toFixed(1) ?? "0.0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {provider.restaurantName}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {provider.area || provider.city || "Local kitchen"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:border-slate-800 dark:bg-amber-500/10 dark:text-amber-300">
                      {provider.deliveryTimeMin
                        ? `${provider.deliveryTimeMin}-${provider.deliveryTimeMax ?? provider.deliveryTimeMin} min`
                        : "Fast"}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                      <MapPin className="size-4 text-amber-600" />
                      {provider.city || "City"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
                      <Clock3 className="size-4 text-amber-600" />
                      {provider.deliveryFee > 0
                        ? `$${provider.deliveryFee.toFixed(2)} delivery`
                        : "Free delivery"}
                    </span>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}