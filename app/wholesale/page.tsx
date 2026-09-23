import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealText, FadeUp } from "@/components/motion/RevealText";
import { ProductCard } from "@/components/store/ProductCard";
import { products } from "@/lib/mock-data";

export default function WholesalePage() {
  const wholesale = products.filter((p) => p.wholesaleEnabled);

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs uppercase tracking-[0.2em] text-flame">For shops &amp; teams</span>
        <RevealText as="h1" className="mt-4 font-display text-[12vw] font-medium leading-[0.9] tracking-tight sm:text-7xl">
          Buy by the case.
        </RevealText>
        <p className="mt-6 max-w-lg text-ink-soft/70">
          Tiered pricing, minimum order quantities and size-ratio packs on every
          wholesale-enabled product. Request a quote and negotiate straight with the seller.
        </p>

        <FadeUp className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Tiered pricing", body: "Unit price drops automatically as quantity crosses each tier." },
            { title: "Size-ratio packs", body: "Order in packs like S1 / M2 / L2 / XL1 instead of guessing quantities." },
            { title: "Direct RFQs", body: "Message the seller, negotiate a price, and convert it straight to an order." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-line p-6">
              <p className="font-medium">{f.title}</p>
              <p className="mt-2 text-sm text-ink-soft/70">{f.body}</p>
            </div>
          ))}
        </FadeUp>

        <div className="mt-16 flex items-end justify-between border-t border-line pt-10">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Wholesale catalog
          </h2>
          <Link
            href="/shop"
            data-cursor="hover"
            className="flex items-center gap-1.5 border-b border-ink pb-0.5 text-sm font-medium uppercase tracking-[0.1em]"
          >
            All products <ArrowUpRight size={15} strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {wholesale.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
