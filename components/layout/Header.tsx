"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Try-On Studio", href: "/studio" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Sell", href: "/sell" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 8);
    if (latest > prev && latest > 160) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-colors duration-500 sm:px-10",
          scrolled || open ? "bg-paper/90 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5" data-cursor="hover">
          <Image
            src="/brand/icon-1024.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-[8px] sm:h-9 sm:w-9"
            priority
          />
          <span className="font-display text-xl font-medium tracking-tight sm:text-2xl">
            Samanta Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[13px] font-medium uppercase tracking-[0.12em] md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} data-cursor="hover" className="group relative py-1">
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button data-cursor="hover" aria-label="Search" className="hidden p-1 sm:block">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <Link href="/cart" data-cursor="hover" aria-label="Cart" className="p-1">
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>
          <Magnetic className="md:hidden">
            <button
              data-cursor="hover"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="p-1"
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </Magnetic>
          <Magnetic className="hidden md:inline-flex">
            <button
              data-cursor="hover"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-ink px-5 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
            >
              Menu
            </button>
          </Magnetic>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-paper sm:px-10"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-2">
              {NAV.map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      data-cursor="hover"
                      className="block border-b border-white/10 py-5 font-display text-[12vw] leading-none tracking-tight sm:text-6xl"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-white/50">
              <span>&copy; {new Date().getFullYear()} Samanta Studio</span>
              <div className="flex gap-6">
                <Link href="/login" onClick={() => setOpen(false)} data-cursor="hover" className="text-white">
                  Sign in
                </Link>
                <Link href="/account" onClick={() => setOpen(false)} data-cursor="hover" className="text-white">
                  Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
