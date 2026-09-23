"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GarmentArt } from "@/components/store/GarmentArt";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const views = [false, true, false] as const;

  return (
    <div className="grid grid-cols-[64px_1fr] gap-4 sm:grid-cols-[80px_1fr]">
      <div className="flex flex-col gap-3">
        {views.map((flip, i) => (
          <button
            key={i}
            data-cursor="hover"
            onClick={() => setActive(i)}
            className={cn(
              "aspect-[4/5] overflow-hidden rounded-[2px] ring-1 ring-transparent transition",
              active === i && "ring-ink",
            )}
          >
            <GarmentArt type={product.garmentType} tone={product.tone} flip={flip} className="h-full w-full" />
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper-dim">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <GarmentArt type={product.garmentType} tone={product.tone} flip={views[active]} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
