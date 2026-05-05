import Link from "next/link";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types";
import CategoryChip from "@/components/ui/CategoryChip";

export default async function CategorySection() {
  const categories = await CategoryService.getCategories();

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What are you craving?
            </h2>
            <p className="text-sm sm:text-2xl text-muted-foreground mt-0.5">
              {categories?.length ?? 0} categories available
            </p>
          </div>
          <Link
            href="/meals"
            className="sm:text-xl sm:font-bold text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            See all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(categories ?? []).map((category: Category) => (
            <Link
              key={category.id}
              href={`/meals?category=${category.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-3 group"
            >
              <CategoryChip
                key={category.id}
                icon={category.icon}
                image={category.image}
                name={category.name}
              />
              <span className="text-xs sm:text-sm font-medium text-center w-[88px] md:w-[100px] leading-tight text-muted-foreground group-hover:text-pink-500 transition-colors duration-200 truncate">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}