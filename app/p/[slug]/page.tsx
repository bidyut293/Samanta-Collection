import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductPurchasePanel } from "@/components/store/ProductPurchasePanel";
import { ProductCard } from "@/components/store/ProductCard";
import { FadeUp, RevealText } from "@/components/motion/RevealText";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/mock-data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/p/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />
          <ProductPurchasePanel product={product} />
        </FadeUp>

        {related.length > 0 && (
          <div className="mt-28 border-t border-line pt-14">
            <RevealText as="h2" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              You might also like
            </RevealText>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
