import Link from "next/link";
import { ArrowRight, DatabaseZap } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";

export function BackendRequired({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center sm:pt-40">
      <DatabaseZap size={30} strokeWidth={1.25} className="text-ink-soft/40" />
      <RevealText as="h1" className="mt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        {title}
      </RevealText>
      <p className="mt-3 max-w-md text-ink-soft/70">{body}</p>
      <Magnetic className="mt-8 inline-block">
        <Link
          href="/shop"
          data-cursor="hover"
          className="flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium uppercase tracking-[0.1em] text-paper"
        >
          Back to shop <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </Magnetic>
    </div>
  );
}
