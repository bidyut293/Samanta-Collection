"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export function RevealText({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  once?: boolean;
}) {
  // The animated span starts translated fully outside this wrapper's clip
  // box, so an IntersectionObserver attached to the span itself sees zero
  // visible area (clipping ancestors count toward the intersection rect).
  // Observing the stable wrapper instead avoids that dead zone.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });

  return (
    <Tag ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function RevealLines({
  lines,
  className,
  lineClassName,
  stagger = 0.08,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <RevealText key={i} delay={i * stagger} className={lineClassName}>
          {line}
        </RevealText>
      ))}
    </div>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
