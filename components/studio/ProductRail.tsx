"use client";

import { GarmentArt } from "@/components/store/GarmentArt";
import { formatINR, cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ProductRail({
  products,
  activeId,
  onSelect,
}: {
  products: Product[];
  activeId: string;
  onSelect: (product: Product) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft/50">Try another piece</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((p) => (
          <button
            key={p.id}
            data-cursor="hover"
            onClick={() => onSelect(p)}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-paper transition",
              activeId === p.id ? "ring-ink" : "ring-transparent",
            )}
            title={`${p.title} · ${formatINR(p.basePrice)}`}
          >
            <GarmentArt type={p.garmentType} tone={p.tone} className="h-full w-full" grain={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
