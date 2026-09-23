import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealText, FadeUp } from "@/components/motion/RevealText";

const LOOKS = [
  {
    src: "/lookbook/male-model.jpg",
    alt: "Man wearing a Samanta Studio white crew-neck tee",
    caption: "Drape Weight Tee · Bone",
    href: "/p/drape-tee-bone",
  },
  {
    src: "/lookbook/female-model.jpg",
    alt: "Woman wearing a Samanta Studio oversized hoodie",
    caption: "Studio Hoodie · Fog",
    href: "/p/studio-hoodie-fog",
  },
];

export function Lookbook() {
  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-flame">Lookbook</span>
            <RevealText as="h2" className="mt-4 font-display text-[9vw] font-medium leading-[0.95] tracking-tight sm:text-5xl">
              On real people, not hangers.
            </RevealText>
          </div>
          <Link
            href="/shop"
            data-cursor="hover"
            className="flex items-center gap-1.5 border-b border-ink pb-0.5 text-sm font-medium uppercase tracking-[0.1em]"
          >
            Shop the look <ArrowUpRight size={15} strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LOOKS.map((look, i) => (
            <FadeUp key={look.src} delay={i * 0.1}>
              <Link href={look.href} data-cursor="hover" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper-dim">
                  <Image
                    src={look.src}
                    alt={look.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
                <p className="mt-3.5 text-[13px] uppercase tracking-[0.12em] text-ink-soft/60">
                  {look.caption}
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
