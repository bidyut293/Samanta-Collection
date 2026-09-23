"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // sessionStorage is unavailable during SSR, so whether we've already
    // shown the preloader this session can only be known once mounted.
    if (sessionStorage.getItem("drape-visited")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / 1400) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("drape-visited", "1");
        setTimeout(() => setVisible(false), 250);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <div className="overflow-hidden">
            <motion.span
              className="block font-display text-[13vw] leading-none tracking-tight sm:text-[7vw]"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Drape
            </motion.span>
          </div>
          <div className="mt-8 h-px w-40 overflow-hidden bg-white/15 sm:w-56">
            <motion.div
              className="h-full bg-flame"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
            {Math.floor(progress)}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
