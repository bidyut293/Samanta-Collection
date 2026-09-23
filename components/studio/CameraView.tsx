"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ScanFace, VideoOff } from "lucide-react";
import { useCamera } from "@/lib/tryon/useCamera";
import { GarmentArt } from "@/components/store/GarmentArt";
import type { Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Phase = "align" | "ready";

export function CameraView({
  product,
  backgroundTone,
  onCapture,
}: {
  product: Product;
  backgroundTone: [string, string];
  onCapture: (canvas: HTMLCanvasElement) => void;
}) {
  const { videoRef, status, facingMode, start, flip, captureFrame } = useCamera();
  const [phase, setPhase] = useState<Phase>("align");
  const [demoMode, setDemoMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Resets the pose-lock phase whenever the feed (re)starts, then
    // simulates detection latency before "locking" the garment overlay.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("align");
    if (status !== "live" && !demoMode) return;
    const t = setTimeout(() => setPhase("ready"), 1900);
    return () => clearTimeout(t);
  }, [status, demoMode]);

  function handleCapture() {
    if (demoMode) {
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 900;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, backgroundTone[0]);
        grad.addColorStop(1, backgroundTone[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      onCapture(canvas);
      return;
    }
    const canvas = captureFrame();
    if (canvas) onCapture(canvas);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-ink"
    >
      {status === "live" && !demoMode && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn("h-full w-full object-cover", facingMode === "user" && "-scale-x-100")}
        />
      )}

      {demoMode && (
        <div
          className="h-full w-full"
          style={{ background: `radial-gradient(120% 120% at 50% 20%, ${backgroundTone[0]}, ${backgroundTone[1]})` }}
        />
      )}

      {(status === "requesting" || status === "idle") && !demoMode && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
          <ScanFace size={28} strokeWidth={1.5} className="animate-pulse" />
          <p className="text-sm">Asking for camera access&hellip;</p>
        </div>
      )}

      {(status === "denied" || status === "unsupported") && !demoMode && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center text-white/80">
          <VideoOff size={28} strokeWidth={1.5} />
          <p className="text-sm">
            {status === "unsupported"
              ? "This browser can't access a camera here."
              : "Camera access was blocked. Allow it in your browser's site settings, or preview with a demo frame."}
          </p>
          <button
            data-cursor="hover"
            onClick={() => setDemoMode(true)}
            className="rounded-full bg-flame px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-paper"
          >
            Use a demo frame
          </button>
        </div>
      )}

      {(status === "live" || demoMode) && (
        <>
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color opacity-30"
            style={{ background: `linear-gradient(160deg, ${backgroundTone[0]}, ${backgroundTone[1]})` }}
          />

          <AnimatePresence>
            {phase === "align" && (
              <motion.div
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <svg viewBox="0 0 120 220" className="h-2/3 opacity-70">
                  <ellipse cx="60" cy="34" rx="22" ry="26" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 6" />
                  <path
                    d="M30 66 C30 56 44 50 60 50 C76 50 90 56 90 66 L96 200 L74 200 L68 110 L64 200 L56 200 L52 110 L46 200 L24 200 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                  />
                </svg>
                <span className="rounded-full bg-black/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white backdrop-blur">
                  Step back so we can see you fully
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "ready" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.55, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-x-0 top-[8%] mx-auto h-[78%] w-[55%]"
              >
                <GarmentArt type={product.garmentType} tone={product.tone} className="h-full w-full rounded-xl" grain={false} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur">
            <span className={cn("h-1.5 w-1.5 rounded-full", phase === "ready" ? "bg-flame" : "bg-white/50")} />
            {phase === "ready" ? "Garment locked" : "Aligning"}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 bg-gradient-to-t from-black/70 to-transparent p-6 pt-14">
            {!demoMode && (
              <button
                data-cursor="hover"
                onClick={flip}
                aria-label="Flip camera"
                className="rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25"
              >
                <RotateCcw size={18} strokeWidth={1.75} />
              </button>
            )}
            <button
              data-cursor="hover"
              onClick={handleCapture}
              disabled={phase !== "ready"}
              aria-label="Capture"
              className="pulse-ring rounded-full border-4 border-white/80 p-1.5 transition disabled:opacity-40"
            >
              <span className="block h-14 w-14 rounded-full bg-flame" />
            </button>
            <div className="w-11" />
          </div>
        </>
      )}
    </div>
  );
}
