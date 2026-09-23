"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { unitPriceFor, savingsFor } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

const TIERS = [
  { min_qty: 12, unit_price: 3600 },
  { min_qty: 36, unit_price: 3150 },
  { min_qty: 100, unit_price: 2800 },
];
const BASE = 4200;

export function WholesaleBand() {
  const [qty, setQty] = useState(36);
  const unit = useMemo(() => unitPriceFor(qty, BASE, TIERS), [qty]);
  const savings = useMemo(() => savingsFor(qty, BASE, TIERS), [qty]);

  return (
    <section className="bg-ink-soft px-6 py-24 text-paper sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-flame-soft">Wholesale</span>
            <RevealText as="h2" className="mt-4 font-display text-[10vw] font-medium leading-[0.95] tracking-tight sm:text-6xl">
              Buy by the case, not the piece.
            </RevealText>
            <FadeUp delay={0.15}>
              <p className="mt-6 max-w-md text-base text-white/70 sm:text-lg">
                MOQs, tiered pricing and size-ratio packs, built in. Request a quote and
                chat with the seller directly &mdash; no spreadsheets, no cold emails.
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <Magnetic className="mt-10 inline-block">
                <Link
                  href="/wholesale"
                  data-cursor="hover"
                  className="flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-ink"
                >
                  Browse wholesale <ArrowUpRight size={16} strokeWidth={2} />
                </Link>
              </Magnetic>
            </FadeUp>
          </div>

          <FadeUp className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Field Overshirt &middot; live pricing</p>
            <div className="mt-6 flex items-end justify-between">
              <span className="font-display text-5xl tracking-tight">{formatINR(unit)}</span>
              <span className="pb-1 text-sm text-white/50">/ unit</span>
            </div>

            <input
              type="range"
              min={1}
              max={150}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="mt-6 w-full accent-flame"
            />
            <div className="mt-2 flex justify-between text-xs text-white/50">
              <span>Qty {qty}</span>
              <span>{savings > 0 ? `You save ${formatINR(savings)}` : "Set your quantity"}</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
              {TIERS.map((t) => (
                <div
                  key={t.min_qty}
                  className={`rounded-lg border px-3 py-3 transition-colors ${
                    qty >= t.min_qty ? "border-flame bg-flame/10" : "border-white/10"
                  }`}
                >
                  <p className="font-medium text-white">{t.min_qty}+</p>
                  <p className="mt-1 text-white/50">{formatINR(t.unit_price)}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
