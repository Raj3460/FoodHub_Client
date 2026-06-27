"use client";

import Image from "next/image";
import { TrendingUp, Users, Headphones, BadgePercent, Zap, ShieldCheck } from "lucide-react";

const advantages = [
  {
    icon: TrendingUp,
    title: "Grow Your Revenue",
    description: "Reach thousands of hungry customers in your area and increase your daily orders.",
  },
  {
    icon: Users,
    title: "Massive Customer Base",
    description: "Get instant access to FoodGhor's growing user base without any extra marketing.",
  },
  {
    icon: Zap,
    title: "Easy Order Management",
    description: "Manage all your orders from one simple dashboard — real-time, hassle-free.",
  },
  {
    icon: BadgePercent,
    title: "Zero Setup Fee",
    description: "Join for free. No hidden charges. You only pay a small commission per order.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our partner support team is available 7 days a week to help you succeed.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description: "Your restaurant is verified and trusted — giving customers confidence to order.",
  },
];

export function AdvantagesSection() {
  return (
    <section className="w-full py-20 px-4 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT — Text content */}
        <div>
         

          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
            Advantages of 
            <span style={{ color: "var(--brand-primary)" }}>Joining FoodGhor</span>
          </h2>
         
          {/* Advantages grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow duration-200"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: "var(--brand-primary)" }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h4 className="text-sm font-bold text-card-foreground mb-0.5">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Handshake image */}
        <div className="relative flex justify-center items-center">
          {/* Orange blob background */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full -z-0"
            style={{
              background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
              filter: "blur(48px)",
            }}
          />

          {/* Decorative ring */}
          <div
            className="absolute w-[380px] h-[380px] rounded-full border-2 border-dashed opacity-20"
            style={{ borderColor: "var(--brand-primary)" }}
          />

          {/* Image card */}
          <div className="relative z-10 w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/provider_handshake.png"
              alt="Partner with FoodGhor"
              fill
              className="object-cover object-center"
            />
            {/* Bottom overlay badge */}
            <div
              className="absolute bottom-4 left-4 right-4 rounded-2xl px-5 py-3 flex items-center gap-3 bg-card/90 border border-border"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--brand-primary)" }}
              >
                <Users size={16} color="white" />
              </div>
              {/* //Todo here apply real data of Our restaurants */}
              {/* <div>
                <p className="text-xs text-muted-foreground">Active Partners</p>
                <p className="text-sm font-extrabold text-card-foreground">2,400+ Restaurants</p>
              </div> */}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}