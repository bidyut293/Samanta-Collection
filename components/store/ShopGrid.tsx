"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/store/ProductCard";
import { categories, products, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const GENDERS = ["all", "women", "men", "unisex"] as const;

export function ShopGrid({ initialCategory }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("all");
  const [tryOnOnly, setTryOnOnly] = useState(false);
  const [wholesaleOnly, setWholesaleOnly] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      if (category !== "all" && p.category !== category) return false;
      if (gender !== "all" && p.gender !== gender && p.gender !== "unisex") return false;
      if (tryOnOnly && !p.tryonEnabled) return false;
      if (wholesaleOnly && !p.wholesaleEnabled) return false;
      return true;
    });
  }, [category, gender, tryOnOnly, wholesaleOnly]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-6">
        <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
          All
        </FilterPill>
        {categories.map((c) => (
          <FilterPill key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
            {c.name}
          </FilterPill>
        ))}

        <span className="mx-2 hidden h-5 w-px bg-line sm:block" />

        {GENDERS.map((g) => (
          <FilterPill key={g} active={gender === g} onClick={() => setGender(g)}>
            {g === "all" ? "Everyone" : g[0].toUpperCase() + g.slice(1)}
          </FilterPill>
        ))}

        <span className="mx-2 hidden h-5 w-px bg-line sm:block" />

        <FilterPill active={tryOnOnly} onClick={() => setTryOnOnly((v) => !v)}>
          Try-on available
        </FilterPill>
        <FilterPill active={wholesaleOnly} onClick={() => setWholesaleOnly((v) => !v)}>
          Wholesale available
        </FilterPill>
      </div>

      <div className="mt-4 flex items-center justify-between py-4 text-xs uppercase tracking-[0.14em] text-ink-soft/50">
        <span>{filtered.length} products</span>
      </div>

      <motion.div layout className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-24 text-center text-ink-soft/60">
          Nothing matches those filters yet &mdash; try widening your search.
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors",
        active ? "border-ink bg-ink text-paper" : "border-line text-ink-soft/70 hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}
