import { notFound } from "next/navigation";
import { RevealText } from "@/components/motion/RevealText";
import { ShopGrid } from "@/components/store/ShopGrid";
import { categories } from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function ShopCategoryPage(
  props: PageProps<"/shop/[category]">,
) {
  const { category } = await props.params;
  const match = categories.find((c) => c.slug === category);
  if (!match) notFound();

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <RevealText as="h1" className="font-display text-[12vw] font-medium leading-[0.9] tracking-tight sm:text-7xl">
          {match.name}
        </RevealText>
        <p className="mt-6 max-w-md text-ink-soft/70">
          Curated {match.name.toLowerCase()}, every piece try-on ready.
        </p>

        <div className="mt-14">
          <ShopGrid initialCategory={match.slug} />
        </div>
      </div>
    </div>
  );
}
