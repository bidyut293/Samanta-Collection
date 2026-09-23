"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCcw, ShoppingBag, Sparkles, X } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ResultSheet({
  open,
  loading,
  image,
  note,
  product,
  onClose,
  onGenerate,
  onRetake,
}: {
  open: boolean;
  loading: boolean;
  image: string | null;
  note: string | null;
  product: Product;
  onClose: () => void;
  onGenerate: () => void;
  onRetake: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-paper sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="text-sm font-medium">Your try-on</span>
              <button data-cursor="hover" onClick={onClose} aria-label="Close">
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="relative aspect-[3/4] bg-ink">
              {image && (
                <Image src={image} alt="Captured try-on frame" fill unoptimized className="object-cover" />
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 text-white">
                  <Sparkles size={26} className="animate-pulse" strokeWidth={1.5} />
                  <p className="text-sm">Generating your realistic look&hellip;</p>
                </div>
              )}
            </div>

            {note && (
              <p className="border-b border-line bg-paper-dim/50 px-5 py-3 text-xs text-ink-soft/70">{note}</p>
            )}

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{product.title}</span>
                <span>{formatINR(product.basePrice)}</span>
              </div>

              {!loading && note === null && (
                <button
                  data-cursor="hover"
                  onClick={onGenerate}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-flame px-6 py-3.5 text-sm font-medium uppercase tracking-[0.1em] text-paper"
                >
                  <Sparkles size={16} strokeWidth={2} /> Generate realistic look
                </button>
              )}

              <div className="flex gap-3">
                <button
                  data-cursor="hover"
                  onClick={onRetake}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-medium uppercase tracking-[0.1em]"
                >
                  <RefreshCcw size={14} strokeWidth={2} /> Retake
                </button>
                <a
                  data-cursor="hover"
                  href={image ?? undefined}
                  download="drape-tryon.jpg"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-medium uppercase tracking-[0.1em]"
                >
                  <Download size={14} strokeWidth={2} /> Save
                </a>
              </div>

              <Link
                href={`/p/${product.slug}`}
                data-cursor="hover"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.1em] text-paper"
              >
                <ShoppingBag size={16} strokeWidth={2} /> Add to cart
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
