"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Heart, MessageSquareText, ShoppingBag } from "lucide-react";
import { SizePicker, ColorPicker } from "@/components/store/SizePicker";
import { TierPriceTable } from "@/components/store/TierPriceTable";
import { Magnetic } from "@/components/motion/Magnetic";
import { unitPriceFor, validateMOQ, savingsFor } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [mode, setMode] = useState<"retail" | "wholesale">("retail");
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [qty, setQty] = useState(product.moq || 1);
  const [added, setAdded] = useState(false);

  const unitPrice = useMemo(
    () => (mode === "wholesale" ? unitPriceFor(qty, product.basePrice, product.tiers) : product.basePrice),
    [mode, qty, product],
  );
  const meetsMOQ = mode === "retail" || validateMOQ(qty, product.moq);
  const savings = mode === "wholesale" ? savingsFor(qty, product.basePrice, product.tiers) : 0;
  const total = unitPrice * (mode === "wholesale" ? qty : 1);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/50">{product.seller}</p>
      <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
        {product.title}
      </h1>
      <p className="mt-3 text-ink-soft/70">{product.fabric}</p>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatINR(unitPrice)}</span>
        {product.compareAt && mode === "retail" && (
          <span className="text-ink-soft/45 line-through">{formatINR(product.compareAt)}</span>
        )}
        {mode === "wholesale" && <span className="text-sm text-ink-soft/50">/ unit</span>}
      </div>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft/75">{product.description}</p>

      {product.wholesaleEnabled && (
        <div className="mt-8 flex rounded-full border border-line p-1 text-sm">
          <ModeTab active={mode === "retail"} onClick={() => setMode("retail")}>
            Retail
          </ModeTab>
          <ModeTab active={mode === "wholesale"} onClick={() => setMode("wholesale")}>
            Wholesale
          </ModeTab>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {product.sizes[0] !== "One size" && (
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft/50">Size</p>
            <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
          </div>
        )}
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft/50">Color &middot; {color}</p>
          <ColorPicker colors={product.colors} value={color} onChange={setColor} />
        </div>

        {mode === "wholesale" && (
          <div>
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-ink-soft/50">
              <span>Quantity &middot; MOQ {product.moq}</span>
              {savings > 0 && <span className="text-flame">You save {formatINR(savings)}</span>}
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={product.moq}
                max={Math.max(product.moq * 10, 200)}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full accent-flame"
              />
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                className="w-20 rounded-lg border border-line px-3 py-2 text-sm"
              />
            </div>
            {!meetsMOQ && (
              <p className="mt-2 text-xs text-flame">
                Minimum order is {product.moq} units for this product.
              </p>
            )}
            {product.sizePack && (
              <p className="mt-2 text-xs text-ink-soft/50">
                Ships as {product.sizePack.name}: {Object.entries(product.sizePack.ratio).map(([s, n]) => `${s}${n}`).join(" / ")} per pack
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Magnetic className="flex-1">
          <button
            data-cursor="hover"
            disabled={!meetsMOQ}
            onClick={() => setAdded(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper transition-opacity disabled:opacity-40"
          >
            <ShoppingBag size={16} strokeWidth={2} />
            {mode === "wholesale" ? `Add ${qty} to cart · ${formatINR(total)}` : "Add to cart"}
          </button>
        </Magnetic>
        <button
          data-cursor="hover"
          aria-label="Wishlist"
          className="flex items-center justify-center rounded-full border border-line px-5 py-4 transition-colors hover:border-ink"
        >
          <Heart size={17} strokeWidth={1.75} />
        </button>
      </div>

      {added && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-flame"
        >
          Added to cart. Payments run in Razorpay test mode on this demo.
        </motion.p>
      )}

      {product.tryonEnabled && (
        <Link
          href={`/studio?product=${product.slug}`}
          data-cursor="hover"
          className="mt-4 flex items-center justify-center gap-2 rounded-full border border-flame px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-flame transition-colors hover:bg-flame hover:text-paper"
        >
          <Camera size={16} strokeWidth={2} /> Try it on, live
        </Link>
      )}

      {product.wholesaleEnabled && (
        <>
          <button
            data-cursor="hover"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-ink-soft/80 transition-colors hover:border-ink"
          >
            <MessageSquareText size={16} strokeWidth={2} /> Request bulk quote
          </button>

          <div className="mt-10">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft/50">Tiered pricing</p>
            <TierPriceTable tiers={product.tiers} basePrice={product.basePrice} activeQty={mode === "wholesale" ? qty : undefined} />
          </div>
        </>
      )}
    </div>
  );
}

function ModeTab({
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
      data-cursor="hover"
      onClick={onClick}
      className={`flex-1 rounded-full px-5 py-2 font-medium uppercase tracking-[0.08em] transition-colors ${
        active ? "bg-ink text-paper" : "text-ink-soft/60"
      }`}
    >
      {children}
    </button>
  );
}
