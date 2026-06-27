"use client";

const steps = [
  {
    id: 1,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        <rect x="18" y="4" width="28" height="48" rx="4" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
        <line x1="18" y1="12" x2="46" y2="12" stroke="var(--brand-primary)" strokeWidth="2"/>
        <line x1="18" y1="48" x2="46" y2="48" stroke="var(--brand-primary)" strokeWidth="2"/>
        <rect x="24" y="18" width="16" height="12" rx="2" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
        <path d="M28 34 L36 34 M28 38 L34 38" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="32" cy="51" r="1.5" fill="var(--brand-primary)"/>
        {/* hand holding phone */}
        <path d="M12 38 Q10 42 12 48 L18 52 Q20 53 22 51 L22 44" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    description:
      "The customer chooses a nearby restaurant or shop and inputs a delivery address via the app or website.",
  },
  {
    id: 2,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* grocery bag */}
        <path d="M20 24 L16 56 L48 56 L44 24 Z" stroke="var(--brand-primary)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <path d="M26 24 Q26 14 32 14 Q38 14 38 24" stroke="var(--brand-primary)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* items inside */}
        <path d="M28 36 Q32 32 36 36" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="29" cy="30" r="2" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
        {/* leaf */}
        <path d="M34 20 Q38 16 42 18 Q40 22 36 22 Z" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
        <path d="M36 22 L34 26" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    description:
      "The restaurant or store uses the tablet that FoodGhor provides to take orders, and they immediately begin preparing the order.",
  },
  {
    id: 3,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* rider */}
        <circle cx="32" cy="12" r="5" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
        {/* helmet */}
        <path d="M27 12 Q27 7 32 7 Q37 7 37 12" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
        {/* body on scooter */}
        <path d="M32 17 L30 26 L20 30" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M30 26 L36 28" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* scooter body */}
        <path d="M14 36 Q16 28 24 28 L40 28 Q46 28 48 34 L50 40 L12 40 Z" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        {/* wheels */}
        <circle cx="18" cy="44" r="6" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
        <circle cx="46" cy="44" r="6" stroke="var(--brand-primary)" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="44" r="2" fill="var(--brand-primary)" opacity="0.3"/>
        <circle cx="46" cy="44" r="2" fill="var(--brand-primary)" opacity="0.3"/>
        {/* box */}
        <rect x="34" y="22" width="12" height="9" rx="1.5" stroke="var(--brand-primary)" strokeWidth="1.5" fill="none"/>
        <line x1="40" y1="22" x2="40" y2="31" stroke="var(--brand-primary)" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    description:
      "Within 30 minutes of the order being placed, our rider shows up on time to pick it up and delivers it.",
  },
  {
    id: 4,
    svg: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* hand */}
        <path d="M12 38 Q10 44 14 50 L28 56 Q34 58 40 54 L54 44 Q56 42 54 40 Q52 38 50 40 L46 43" stroke="var(--brand-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46 43 L50 36 Q52 32 48 30 Q44 28 42 32 L40 36" stroke="var(--brand-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M40 36 L42 28 Q43 24 39 23 Q35 22 34 26 L32 34" stroke="var(--brand-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M32 34 L33 26 Q33 22 29 22 Q26 22 25 26 L24 40" stroke="var(--brand-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* coins / money box */}
        <rect x="28" y="6" width="20" height="16" rx="3" stroke="var(--brand-primary)" strokeWidth="1.8" fill="none"/>
        <path d="M33 10 Q38 8 43 10" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M33 14 Q38 12 43 14" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* leaf accent */}
        <path d="M20 14 Q16 8 20 6 Q22 10 20 14 Z" stroke="var(--brand-primary)" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    description:
      "Each month, FoodGhor sends you money earned from your orders and gives you full performance data.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-16">
          How it Works
        </h2>

        {/* 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center gap-5 group">

              {/* Icon with connector line */}
              <div className="relative flex items-center justify-center w-full">
                {/* Connector line to next (desktop only) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute left-[calc(50%+36px)] right-[-50%] top-1/2 -translate-y-1/2 h-px"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, var(--brand-primary) 0px, var(--brand-primary) 6px, transparent 6px, transparent 14px)",
                      opacity: 0.3,
                    }}
                  />
                )}

                {/* Icon circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    background: "color-mix(in srgb, var(--brand-primary) 8%, var(--background))",
                    border: "1.5px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)",
                  }}
                >
                  {step.svg}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}