"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [coarse, setCoarse] = useState(true);

  useEffect(() => {
    // Reads a browser-only API (unavailable during SSR) to correct the
    // server-rendered default, so this can't be computed during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCoarse(window.matchMedia("(pointer: coarse)").matches);

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("[data-cursor='hover']"));
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  if (coarse) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: hovering ? 56 : 8,
          height: hovering ? 56 : 8,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
