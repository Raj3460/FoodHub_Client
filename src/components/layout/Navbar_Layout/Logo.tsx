"use client";

import Link from "next/link";

interface LogoProps {
  title: string;
  className?: string;
}

export function Logo({ title, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-lg">
        F
      </span>
      <span className="text-lg font-semibold tracking-tighter">{title}</span>
    </Link>
  );
}