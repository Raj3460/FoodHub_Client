import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                F
              </span>
              FoodHub
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              FoodHub connects you with great local kitchens and fast delivery. Order fresh meals, browse top restaurants, and enjoy curated favorites.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Link href="mailto:support@foodhub.com" className="inline-flex items-center gap-2 text-sm hover:text-foreground">
                <Mail className="size-4" />
                support@foodhub.com
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/meals" className="hover:text-foreground">
                  Meals
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-foreground">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-foreground">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Company
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Support
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FoodHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full p-2 transition hover:bg-muted hover:text-foreground">
              <Facebook className="size-4" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full p-2 transition hover:bg-muted hover:text-foreground">
              <Instagram className="size-4" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-full p-2 transition hover:bg-muted hover:text-foreground">
              <Twitter className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
