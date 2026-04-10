import { Button } from "@/components/ui/button";

// app/components/HeroSection.tsx
export default function HeroSection() {
  return (
    <div>
       <main className="relative overflow-hidden  from-amber-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.35),transparent_40%)]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-300/20 blur-3xl dark:bg-sky-500/10" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-2xl">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/15 ">
              Fresh meals, local kitchens
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              FoodHub brings delicious food to your door, faster than ever.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Discover nearby restaurants, browse chef-crafted meals, and place pickup or delivery orders in just a few taps. FoodHub makes it easy to eat well every day.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button className="min-w-[12rem] px-6 py-3" size="lg">
                Order now
              </Button>
              <Button variant="outline" className="min-w-[12rem] px-6 py-3" size="lg">
                Explore menu
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">500+</p>
                <p className="mt-2 text-sm text-muted-foreground">Restaurants</p>
              </div>
              <div className="rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">4.9</p>
                <p className="mt-2 text-sm text-muted-foreground">Average rating</p>
              </div>
              <div className="rounded-3xl border border-border bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-900/75">
                <p className="text-3xl font-semibold text-foreground">30 min</p>
                <p className="mt-2 text-sm text-muted-foreground">Delivery time</p>
              </div>
            </div>
          </section>

          <section className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-yellow-50 via-white to-amber-100 p-6 shadow-2xl shadow-amber-200/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-slate-950/40">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_35%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                  Featured pick
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  Spicy chicken bowl
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Warm grain bowl with tender chicken, crunchy greens, citrus dressing, and house-made chili glaze.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white/90 p-4 shadow-sm dark:bg-slate-950/80">
                <div>
                  <p className="text-lg font-semibold text-foreground">$12.99</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Chef favorite</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white">
                  Hot & ready
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
    </div>
  );
}
