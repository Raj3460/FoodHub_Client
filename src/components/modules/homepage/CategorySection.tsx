//src/components/modules/homepage/CategorySection.tsx
 


import { Button } from "@/components/ui/button";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";


export default async function CategorySection() {
  const categories = await CategoryService.getCategories();
  // console.log("this is categories|: ", categories);

  return (
    <section className="bg-white py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Discover delicious meals from various cuisines and categories
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:from-slate-900 dark:to-slate-800"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl transition-transform duration-300 group-hover:scale-110 dark:bg-primary/20">
                  {category.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  Explore →
                </Button>
              </div>

              {/* Subtle background pattern */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.05),transparent_50%)]" />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="px-8">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}