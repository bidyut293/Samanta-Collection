import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";
import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/lib/mock-data";

export function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealText as="h2" className="font-display text-[9vw] font-medium leading-[0.95] tracking-tight sm:text-5xl">
            This week&rsquo;s edit
          </RevealText>
          <Link
            href="/shop"
            data-cursor="hover"
            className="flex items-center gap-1.5 border-b border-ink pb-0.5 text-sm font-medium uppercase tracking-[0.1em]"
          >
            View all <ArrowUpRight size={15} strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
