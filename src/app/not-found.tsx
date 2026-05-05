import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/30 dark:to-slate-950/80 px-6 py-24 text-center">
      {/* ব্যাকগ্রাউন্ড ইফেক্ট */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
        <span className="text-[20rem] font-black text-foreground select-none">404</span>
      </div>

      <div className="relative z-10 max-w-md">
        <p className="text-7xl font-extrabold text-orange-500 sm:text-8xl">404</p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="min-w-[10rem]">
            <Link href="/">
              <HomeIcon className="mr-2 size-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="min-w-[10rem]">
            <Link href="/meals">
              <SearchIcon className="mr-2 size-4" />
              Browse meals
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}