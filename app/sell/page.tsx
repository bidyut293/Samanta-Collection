import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, Camera } from "lucide-react";
import { RevealText, FadeUp } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";

const PERKS = [
  {
    icon: Camera,
    title: "Try-on lifts conversion",
    body: "Every listing gets a live AR try-on for free. Shoppers who try on convert more &mdash; you'll see it in your dashboard.",
  },
  {
    icon: Boxes,
    title: "Retail and wholesale, one listing",
    body: "Turn on tiered pricing, MOQs and size packs without duplicating your catalog.",
  },
  {
    icon: BarChart3,
    title: "Numbers that matter",
    body: "Try-ons, try-on-to-cart rate, and RFQs in one dashboard, not a spreadsheet.",
  },
];

export default function SellPage() {
  return (
    <div>
      <section className="bg-ink px-6 py-32 text-paper sm:px-10 sm:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-flame-soft">Sell on Samanta Studio</span>
          <RevealText
            as="h1"
            className="mx-auto mt-4 font-display text-[13vw] font-medium leading-[0.92] tracking-tight sm:text-7xl"
          >
            Your rack, everyone&rsquo;s camera.
          </RevealText>
          <FadeUp delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-white/70">
              List once. Sell retail, sell wholesale, and let buyers try before they buy &mdash;
              live, on their own camera.
            </p>
            <Magnetic className="mt-10 inline-block">
              <Link
                href="/seller"
                data-cursor="hover"
                className="flex items-center gap-2 rounded-full bg-flame px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper"
              >
                Start selling <ArrowUpRight size={16} strokeWidth={2} />
              </Link>
            </Magnetic>
          </FadeUp>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
          {PERKS.map((perk, i) => (
            <FadeUp key={perk.title} delay={i * 0.08} className="rounded-2xl border border-line p-8">
              <perk.icon size={22} strokeWidth={1.5} className="text-flame" />
              <h3 className="mt-5 text-lg font-medium">{perk.title}</h3>
              <p className="mt-2 text-sm text-ink-soft/70">{perk.body}</p>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
