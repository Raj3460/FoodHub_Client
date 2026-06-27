import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="relative overflow-hidden from-amber-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Ambient light effects */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.4),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl dark:bg-sky-500/5" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left column: Text content */}
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm dark:bg-primary/15">
              ✨ Fresh meals, local kitchens
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              FoodGhor brings delicious food to your door,{" "}
              <span className="relative whitespace-nowrap bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                faster than ever
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Discover nearby restaurants, browse chef-crafted meals, and place pickup or delivery
              orders in just a few taps. FoodGhor makes it easy to eat well every day.
            </p>

            {/* CTA Buttons - Orange themed */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[12rem] border-none bg-orange-500 px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg dark:bg-orange-600 dark:hover:bg-orange-700">
                <Link href="/meals">Order now →</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[12rem] border-2 border-orange-500 px-8 py-3 font-semibold text-orange-600 backdrop-blur-sm transition-all hover:bg-orange-50 hover:text-orange-700 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/30">
                <Link href="/meals">Explore menu</Link>
              </Button>
            </div>

            {/* Trust stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="group rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">🍽️ 500+</p>
                <p className="mt-2 text-sm text-muted-foreground">Partner restaurants</p>
              </div>
              <div className="group rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">⭐ 4.9</p>
                <p className="mt-2 text-sm text-muted-foreground">Average rating</p>
              </div>
              <div className="group rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">⏱️ 30 min</p>
                <p className="mt-2 text-sm text-muted-foreground">Avg. delivery time</p>
              </div>
            </div>
          </div>

          {/* Right column: Featured meal card (enhanced) */}
          <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-amber-100/60 via-white to-amber-50/70 p-6 shadow-2xl shadow-amber-200/30 backdrop-blur-sm transition-all duration-300 hover:shadow-amber-300/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-slate-950/50 dark:hover:shadow-slate-800/30 lg:p-8">
            <div className="pointer-events-none absolute -inset-1 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.25),transparent_50%)]" />

            {/* Mock meal image placeholder */}
            <div className="relative mb-6 flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-400/20 dark:from-amber-500/10 dark:to-orange-400/10">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-5xl drop-shadow-md">🍗🌶️</span>
                <span className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Chef's signature
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                  FEATURED PICK
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  🔥 Hot & ready
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                Spicy Grilled Chicken Bowl
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-amber-500">
                  {"★".repeat(4)}<span className="text-amber-300">★</span>
                </div>
                <span className="text-sm text-muted-foreground">(1.2k reviews)</span>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Warm grain bowl with tender grilled chicken, crunchy mixed greens, zesty citrus
                dressing, and our signature house-made chili glaze.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/80 p-4 shadow-inner backdrop-blur-sm dark:bg-slate-950/80">
              <div>
                <p className="text-2xl font-bold text-foreground">$12.99</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Chef favorite</p>
              </div>
              <Button asChild size="sm" variant="ghost" className="gap-1 rounded-full bg-orange-500/10 px-4 text-orange-600 hover:bg-orange-500/20 dark:text-orange-400">
                <Link href="/meals">Order now →</Link>
              </Button>
            </div>

            {/* Kitchen badge */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>👨‍🍳 Prepared by Chef Maria</span>
              <span>⚡ Ready in 15-20 min</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}