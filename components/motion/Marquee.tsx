"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  speed = 28,
  reverse = false,
}: {
  items: string[];
  className?: string;
  speed?: number;
  reverse?: boolean;
}) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className="flex shrink-0 items-center gap-10 pr-10"
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}`,
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span>{item}</span>
            <span aria-hidden className="text-[0.5em] opacity-40">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
