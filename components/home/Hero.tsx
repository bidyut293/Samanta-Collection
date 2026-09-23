"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { RevealLines } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { GarmentArt } from "@/components/store/GarmentArt";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-[640px] flex-col justify-between overflow-hidden bg-ink text-paper">
      <motion.div style={{ y: y2, scale }} className="absolute inset-0 opacity-90">
        <div className="grid h-full grid-cols-3">
          <GarmentArt type="outerwear" tone={["#c9491f", "#1b120c"]} className="h-full" />
          <GarmentArt type="dress" tone={["#5f1f2b", "#150a0c"]} className="h-full" flip />
          <GarmentArt type="top" tone={["#4a5240", "#0e120c"]} className="h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      </motion.div>

      <div className="relative z-10 flex items-center justify-between px-6 pt-28 text-xs uppercase tracking-[0.2em] text-white/60 sm:px-10">
        <span>Retail &middot; Wholesale &middot; AI Try-On</span>
        <span className="hidden sm:block">Est. 2026</span>
      </div>

      <motion.div style={{ y: y1, opacity }} className="relative z-10 px-6 pb-16 sm:px-10">
        <RevealLines
          lines={["Wear it before", "you buy it."]}
          className="font-display text-[13vw] font-medium leading-[0.92] tracking-tight sm:text-[7.5vw]"
        />

        <div className="mt-8 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <p className="max-w-md text-balance text-base text-white/70 sm:text-lg">
            Point your camera at yourself. Samanta Studio drops any product straight onto you, live &mdash;
            then lets you buy retail or by the case.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/studio"
                data-cursor="hover"
                className="flex items-center gap-2 rounded-full bg-flame px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper transition-transform"
              >
                Try the studio <ArrowUpRight size={16} strokeWidth={2} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/shop"
                data-cursor="hover"
                className="flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper transition-colors hover:bg-white/10"
              >
                Shop the drop <ArrowDownRight size={16} strokeWidth={2} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40"
      >
        Scroll
      </motion.div>
    </section>
  );
}
