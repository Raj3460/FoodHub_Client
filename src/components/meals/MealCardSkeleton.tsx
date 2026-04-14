export function MealCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}