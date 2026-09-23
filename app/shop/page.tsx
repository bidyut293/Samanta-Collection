import { RevealText } from "@/components/motion/RevealText";
import { ShopGrid } from "@/components/store/ShopGrid";

export default function ShopPage() {
  return (
    <div className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <RevealText as="h1" className="font-display text-[12vw] font-medium leading-[0.9] tracking-tight sm:text-7xl">
          Shop everything
        </RevealText>
        <p className="mt-6 max-w-md text-ink-soft/70">
          Every piece here supports live try-on. Filter by fit, by gender, or just by what
          ships in bulk.
        </p>

        <div className="mt-14">
          <ShopGrid />
        </div>
      </div>
    </div>
  );
}
