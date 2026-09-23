import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/motion/Marquee";
import { TryOnShowcase } from "@/components/home/TryOnShowcase";
import { Lookbook } from "@/components/home/Lookbook";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { products } from "@/lib/mock-data";

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <Hero />

      <div className="border-y border-line bg-paper py-4">
        <Marquee
          items={["Free returns", "AI try-on on every product", "Retail & wholesale", "Ships in 48 hours"]}
          className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft/60"
        />
      </div>

      <TryOnShowcase />
      <Lookbook />
      <FeaturedGrid products={featured} />
      <WholesaleBand />
    </>
  );
}
