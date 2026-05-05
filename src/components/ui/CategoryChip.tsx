"use client";

import { useEffect, useState } from "react";

interface CategoryChipProps {
  icon?: string | null;
  image?: string | null;
  name: string;
}

export default function CategoryChip({ icon, image, name }: CategoryChipProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [cacheBuster, setCacheBuster] = useState("");
  const displayIcon = icon || "🍽️";

  // ক্লায়েন্ট মাউন্টের পর ক্যাশ-বাস্টার সেট করি
  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, []);

  // ইমেজের পাথ + ক্যাশ-বাস্টার (শুধু ক্লায়েন্টে)
  const imageSrc = image ? `${image}${cacheBuster}` : undefined;

  return (
    <div
      className="
        w-[88px] h-[88px] md:w-[100px] md:h-[100px]
        rounded-full overflow-hidden
        border-2 border-border bg-card relative
        transition-all duration-200 ease-in-out
        group-hover:scale-105 group-hover:border-pink-400
        group-hover:shadow-md group-hover:shadow-pink-100
        dark:group-hover:shadow-pink-950/30
      "
    >
      {/* আইকন – ইমেজ না থাকলে বা ইমেজ ফেইল করলে দেখাবে */}
      {(!image || imgFailed) && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">
          {displayIcon}
        </div>
      )}

      {/* ইমেজ – শুধু তখনই দেখাব যখন image আছে এবং এখনো ফেইল করেনি */}
      {image && !imgFailed && (
        <img
          src={imageSrc}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}