"use client";

import { useMemo, useState } from "react";
import { CameraView } from "@/components/studio/CameraView";
import { ProductRail } from "@/components/studio/ProductRail";
import { BackgroundPicker } from "@/components/studio/BackgroundPicker";
import { ResultSheet } from "@/components/studio/ResultSheet";
import { RevealText, FadeUp } from "@/components/motion/RevealText";
import { renderMockLook } from "@/lib/tryon/compositor";
import { products, tryonBackgrounds, getProductBySlug } from "@/lib/mock-data";

const TRYON_PRODUCTS = products.filter((p) => p.tryonEnabled);

async function urlToDataURL(url: string): Promise<string> {
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function StudioClient({ initialSlug }: { initialSlug?: string }) {
  const initial = (initialSlug && getProductBySlug(initialSlug)) || TRYON_PRODUCTS[0];
  const [product, setProduct] = useState(initial);
  const [backgroundId, setBackgroundId] = useState(tryonBackgrounds[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const background = useMemo(
    () => tryonBackgrounds.find((b) => b.id === backgroundId) ?? tryonBackgrounds[0],
    [backgroundId],
  );

  function handleCapture(canvas: HTMLCanvasElement) {
    setImage(canvas.toDataURL("image/jpeg", 0.92));
    setNote(null);
    setSheetOpen(true);
  }

  async function handleGenerate() {
    if (!image) return;
    setLoading(true);
    try {
      const productImage = product.image ? await urlToDataURL(product.image) : null;
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, productTitle: product.title, productImage }),
      });
      const data = await res.json();
      if (data.mock) {
        const canvas = document.createElement("canvas");
        const img = new window.Image();
        img.src = image;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        setImage(renderMockLook(canvas, product.tone, product.title));
        setNote(data.message);
      } else if (data.image) {
        setImage(data.image);
        setNote(null);
      } else {
        setNote(data.error ?? "Something went wrong generating your look.");
      }
    } catch {
      setNote("Couldn't reach the try-on service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleRetake() {
    setSheetOpen(false);
    setImage(null);
    setNote(null);
  }

  return (
    <div className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <RevealText as="h1" className="font-display text-[10vw] font-medium leading-[0.95] tracking-tight sm:text-6xl">
          Try-On Studio
        </RevealText>
        <p className="mt-4 max-w-lg text-ink-soft/70">
          Live camera, real garments. Step into frame, let the fit lock on, then generate a
          photoreal shot when you want to be sure.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr]">
          <FadeUp className="mx-auto lg:mx-0">
            <CameraView product={product} backgroundTone={background.tone} onCapture={handleCapture} />
          </FadeUp>

          <FadeUp delay={0.1} className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-soft/50">Now trying on</p>
              <p className="mt-1 text-lg font-medium">{product.title}</p>
            </div>
            <ProductRail products={TRYON_PRODUCTS} activeId={product.id} onSelect={setProduct} />
            <BackgroundPicker value={backgroundId} onChange={setBackgroundId} />

            <div className="rounded-2xl border border-line bg-paper-dim/40 p-5 text-sm text-ink-soft/70">
              <p className="font-medium text-ink">How this works</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Allow camera access and step back until you&rsquo;re fully in frame.</li>
                <li>The garment locks on automatically once you&rsquo;re detected.</li>
                <li>Tap capture, then generate a photoreal AI render if you want one.</li>
              </ol>
            </div>
          </FadeUp>
        </div>
      </div>

      <ResultSheet
        open={sheetOpen}
        loading={loading}
        image={image}
        note={note}
        product={product}
        onClose={() => setSheetOpen(false)}
        onGenerate={handleGenerate}
        onRetake={handleRetake}
      />
    </div>
  );
}
