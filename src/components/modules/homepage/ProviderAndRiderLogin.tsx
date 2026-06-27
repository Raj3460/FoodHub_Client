import Link from "next/link";

export default function ProviderAndRiderLogin() {
  return (
    <section className="w-full bg-background py-16 px-4">
      <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* ── Partner Card ── */}
        <div className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
          {/* Image */}
          <div className="shrink-0 overflow-hidden rounded-xl" style={{ width: 160, height: 160 }}>
            <img
              // src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=320&q=80"
              src="/foodghor_Restouant.png"
              alt="Restaurant interior"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-foreground leading-snug">
              List Your Restaurant on FoodGhor
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Would you like millions of new customers to enjoy your amazing food and groceries? Let's start our partnership today!
            </p>
            <div className="mt-1  ">
              <Link
                href=""
                className=" cursor-not-allowed  inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#f97316" }}
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>

        {/* ── Rider Card ── */}
        <div className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
          {/* Image */}
          <div className="shrink-0 overflow-hidden rounded-xl" style={{ width: 160, height: 160 }}>
            <img
              // src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&q=80"
              src="/foodGhorRider.png"
              alt="Delivery rider on scooter"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-foreground leading-snug">
              Become a FoodGhor Hero
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Are you a man of speed and a master of navigation? Become a FoodGhor Hero and earn up to 25,000 TK each month while spreading joy to the doorsteps.
            </p>
            <div className="mt-1">
              <Link
                href="/become-a-hero"
                className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#f97316" }}
              >
                Become a Hero
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}