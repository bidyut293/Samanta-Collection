"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { GarmentArt } from "@/components/store/GarmentArt";
import { ProductImage } from "@/components/store/ProductImage";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const wholesaleFrom = product.tiers.length
    ? Math.min(...product.tiers.map((t) => t.unit_price))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/p/${product.slug}`}
        data-cursor="hover"
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper-dim">
          {product.image ? (
            <div
              className="absolute inset-0 transition-transform duration-700"
              style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
            >
              <ProductImage product={product} className="h-full w-full" sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: hovered ? 0 : 1 }}>
                <GarmentArt type={product.garmentType} tone={product.tone} className="h-full w-full" />
              </div>
              <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: hovered ? 1 : 0 }}>
                <GarmentArt type={product.garmentType} tone={product.tone} flip className="h-full w-full" />
              </div>
            </>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="rounded-full bg-paper px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                New
              </span>
            )}
            {product.tryonEnabled && (
              <span className="flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-paper backdrop-blur">
                <Camera size={11} strokeWidth={1.75} /> Try on
              </span>
            )}
          </div>

          {wholesaleFrom && (
            <span className="absolute bottom-3 left-3 rounded-full bg-flame px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-paper">
              Wholesale from {formatINR(wholesaleFrom)}
            </span>
          )}

          <motion.div
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-paper/95"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <div className="mt-3.5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-medium leading-snug">{product.title}</h3>
            <p className="mt-0.5 text-[13px] text-ink-soft/70">{product.fabric}</p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-[15px] font-medium">{formatINR(product.basePrice)}</span>
            {product.compareAt && (
              <span className="ml-1.5 text-[13px] text-ink-soft/50 line-through">
                {formatINR(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
