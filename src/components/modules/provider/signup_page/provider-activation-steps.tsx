"use client";

import { UserPlus, Store, ShieldCheck, Rocket } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account with basic information.",
  },
  {
    id: 2,
    icon: Store,
    title: "Add Your Restaurant",
    description: "Provide details about your restaurant and upload images.",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Get Approved",
    description: "Our team reviews your application and approves your restaurant.",
  },
  {
    id: 4,
    icon: Rocket,
    title: "Start Selling",
    description: "Add meals and start selling on FoodGhor.",
  },
];

export function StepsToActivation() {
  return (
    <section
      className="w-full py-16 px-4"
      style={{ background: "var(--brand-primary)" }}
    >
      {/* Header */}
      <div className="text-center mb-14">
       
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          4 Steps to Activation
        </h2>
        {/* <p className="text-white/70 mt-3 text-base max-w-md mx-auto">
          From signup to your first order — it only takes a few minutes.
        </p> */}
      </div>

      {/* Steps */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connector line */}
        <div
          className="hidden md:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-[2px] z-0"
          style={{
            background:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 8px, transparent 8px, transparent 18px)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon circle */}
                <div
                  className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1"
                  style={
                    isLast
                      ? {
                          background: "white",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        }
                      : {
                          background: "rgba(255,255,255,0.18)",
                          border: "2px solid rgba(255,255,255,0.5)",
                        }
                  }
                >
                  <Icon
                    size={28}
                    style={{ color: isLast ? "var(--brand-primary)" : "white" }}
                    strokeWidth={1.8}
                  />

                  {/* Step number badge */}
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{
                      background: isLast ? "var(--brand-primary-dark)" : "rgba(0,0,0,0.2)",
                      color: "white",
                    }}
                  >
                    {step.id}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-base font-bold text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-[180px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

     
     
    </section>
  );
}