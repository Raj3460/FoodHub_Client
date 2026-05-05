//src/components/meals/MealCardSkeleton.tsx

export function MealCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-border bg-card">
      <div className="h-44 bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-2/3 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-1/2 rounded-full bg-muted" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-7 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}