"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Sparkles, ScanFace, Check } from "lucide-react";
import { FadeUp, RevealText } from "@/components/motion/RevealText";
import { GarmentArt } from "@/components/store/GarmentArt";

const STAGES = [
  { key: "detect", label: "Finding you in frame", icon: ScanFace, hint: "Step back a little" },
  { key: "scan", label: "Reading your pose", icon: Camera, hint: "Hold still" },
  { key: "generate", label: "Generating your look", icon: Sparkles, hint: "This takes a few seconds" },
  { key: "done", label: "Looks good on you", icon: Check, hint: "Add to cart or try another" },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Open Try-On on any product",
    body: "One tap from the product page starts your camera — front or back, no app to install.",
  },
  {
    n: "02",
    title: "Step into frame",
    body: "A live silhouette guide tells you exactly where to stand so the fit reads correctly.",
  },
  {
    n: "03",
    title: "The garment locks on, live",
    body: "MediaPipe tracks your pose in the browser and drapes the product over you in real time.",
  },
  {
    n: "04",
    title: "Generate the realistic shot",
    body: "One button sends a snapshot to Gemini for a photoreal composite you can save or share.",
  },
];

export function TryOnShowcase() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const Active = STAGES[stage];

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-10">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-flame">Try-On Studio</span>
          <RevealText as="h2" className="mt-4 font-display text-[10vw] font-medium leading-[0.95] tracking-tight sm:text-6xl">
            See it on you, not on a hanger.
          </RevealText>
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-md text-base text-ink-soft/80 sm:text-lg">
              No dressing room, no guesswork. Your camera becomes the fitting room —
              live AR while you browse, and a photoreal AI render when you want to be sure.
            </p>
          </FadeUp>

          <div className="mt-12 space-y-0 divide-y divide-line border-t border-line">
            {STEPS.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.08} className="flex gap-6 py-6">
                <span className="font-mono text-xs text-ink-soft/40">{step.n}</span>
                <div>
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft/70">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp className="relative">
          <div className="sticky top-28 mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-ink shadow-[0_40px_80px_-30px_rgba(20,18,15,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-white/70">
                <span className="h-2 w-2 rounded-full bg-flame" />
                <span className="text-xs font-medium uppercase tracking-[0.14em]">Live Try-On</span>
              </div>
              <span className="font-mono text-[10px] text-white/30">00:0{stage + 1}</span>
            </div>

            <div className="relative aspect-[3/4]">
              <GarmentArt type="top" tone={["#2b2f26", "#0a0b08"]} className="h-full w-full" grain={false} />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <motion.div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/25"
                  animate={{ scale: stage === 2 ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 1.1, repeat: stage === 2 ? Infinity : 0 }}
                >
                  <span className="absolute inset-0 rounded-full border border-flame/60 pulse-ring" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={Active.key}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Active.icon size={30} strokeWidth={1.5} className="text-paper" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={Active.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium text-white">{Active.label}</p>
                    <p className="text-xs text-white/50">{Active.hint}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-white/60">
              <span className="text-[11px] uppercase tracking-[0.14em]">Field Overshirt &middot; Clay</span>
              <span className="rounded-full bg-flame px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-paper">
                Generate look
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
