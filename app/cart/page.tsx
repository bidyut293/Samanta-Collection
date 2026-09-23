import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";

export default function CartPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center sm:pt-40">
      <ShoppingBag size={30} strokeWidth={1.25} className="text-ink-soft/40" />
      <RevealText as="h1" className="mt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Your cart is empty
      </RevealText>
      <p className="mt-3 max-w-sm text-ink-soft/70">
        Carts sync to your account once Supabase Auth is wired in &mdash; for now, add
        something from the shop to see the checkout flow.
      </p>
      <Magnetic className="mt-8 inline-block">
        <Link
          href="/shop"
          data-cursor="hover"
          className="flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper"
        >
          Browse the shop <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </Magnetic>
    </div>
  );
}
