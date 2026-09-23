import Link from "next/link";
import { Marquee } from "@/components/motion/Marquee";
import { FadeUp } from "@/components/motion/RevealText";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <Marquee
        items={["New drops weekly", "Bulk pricing for shops", "AI try-on, live", "Made to move"]}
        className="border-b border-white/10 py-5 font-display text-2xl uppercase tracking-tight text-white/70 sm:text-4xl"
      />

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:px-10">
        <FadeUp>
          <Link href="/" className="font-display text-[15vw] leading-[0.85] tracking-tight sm:text-[9vw]">
            Drape
          </Link>
        </FadeUp>

        <div className="mt-14 grid grid-cols-2 gap-10 border-t border-white/10 pt-10 text-sm sm:grid-cols-4">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">Shop</p>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/shop" data-cursor="hover">All products</Link></li>
              <li><Link href="/shop/outerwear" data-cursor="hover">Outerwear</Link></li>
              <li><Link href="/wholesale" data-cursor="hover">Wholesale</Link></li>
              <li><Link href="/studio" data-cursor="hover">Try-On Studio</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">Sell</p>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/sell" data-cursor="hover">Become a seller</Link></li>
              <li><Link href="/seller" data-cursor="hover">Seller dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">Company</p>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#" data-cursor="hover">About</Link></li>
              <li><Link href="#" data-cursor="hover">Careers</Link></li>
              <li><Link href="#" data-cursor="hover">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">Follow</p>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#" data-cursor="hover">Instagram</Link></li>
              <li><Link href="#" data-cursor="hover">Pinterest</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Drape. Demo build.</span>
          <span>Payments in Razorpay test mode</span>
        </div>
      </div>
    </footer>
  );
}
