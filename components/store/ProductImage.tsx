import Image from "next/image";
import { GarmentArt } from "@/components/store/GarmentArt";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function ProductImage({
  product,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={product.image}
          alt={`${product.title} · ${product.colors[0]?.name ?? ""}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return <GarmentArt type={product.garmentType} tone={product.tone} className={className} />;
}
