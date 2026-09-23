"use client";

import { formatINR } from "@/lib/utils";
import type { PriceTier } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TierPriceTable({
  tiers,
  basePrice,
  activeQty,
}: {
  tiers: PriceTier[];
  basePrice: number;
  activeQty?: number;
}) {
  const rows = [{ min_qty: 1, unit_price: basePrice }, ...tiers];

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-paper-dim/60 text-left text-xs uppercase tracking-[0.1em] text-ink-soft/60">
            <th className="px-4 py-3 font-medium">Quantity</th>
            <th className="px-4 py-3 font-medium">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const next = rows[i + 1];
            const isActive =
              activeQty !== undefined &&
              activeQty >= row.min_qty &&
              (!next || activeQty < next.min_qty);
            return (
              <tr
                key={row.min_qty}
                className={cn(
                  "border-b border-line last:border-0 transition-colors",
                  isActive && "bg-flame/10",
                )}
              >
                <td className="px-4 py-3">
                  {row.min_qty === 1 ? `1 – ${next ? next.min_qty - 1 : ""}` : `${row.min_qty}+`}
                </td>
                <td className="px-4 py-3 font-medium">{formatINR(row.unit_price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
