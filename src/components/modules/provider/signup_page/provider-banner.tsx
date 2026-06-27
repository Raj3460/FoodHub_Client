// src/components/modules/provider/signup_page/provider-banner.tsx

"use client";

export function ProviderBanner() {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "180px" }}>

      {/* Background image — full cover */}
      <div className="absolute inset-0 z-0">
        <img
          src="/foodghor_Restouant.png"
          alt="Restaurant interior"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.75)" }}
        />
        {/* dark overlay so text always readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Orange curved overlay — left side only */}
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)",
          clipPath: "ellipse(48% 100% at 0% 20%)",
          opacity: 0.95,
        }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "20px 20px",
          }}
        />
        {/* Wave */}
        <svg
          className="absolute bottom-6 left-8 opacity-30"
          width="120" height="40" viewBox="0 0 120 40" fill="none"
        >
          <path d="M0 20 Q15 5 30 20 Q45 35 60 20 Q75 5 90 20 Q105 35 120 20"
            stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M0 30 Q15 15 30 30 Q45 45 60 30 Q75 15 90 30 Q105 45 120 30"
            stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mobile: orange gradient overlay from left */}
      <div
        className="absolute inset-0 z-10 md:hidden"
        style={{
          background: "linear-gradient(to right, color-mix(in srgb, var(--brand-primary) 85%, transparent) 0%, transparent 80%)",
        }}
      />

      {/* Text — always visible on all screens */}
      <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-16 py-10 md:py-14 max-w-sm">
        <p className="text-white/90 text-xs md:text-sm font-semibold tracking-widest uppercase mb-2">
          FoodGhor Partner
        </p>
        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
          Become a <br />
          <span style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            Partner
          </span>
        </h1>
        <p className="text-white/85 text-xs sm:text-sm md:text-base mt-3 max-w-[200px] md:max-w-[220px] leading-relaxed">
          Grow your restaurant business with thousands of hungry customers.
        </p>
      </div>

    </div>
  );
}