import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { CursorDot } from "@/components/motion/CursorDot";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-base",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drape — Wear it before you buy it",
  description:
    "Drape is a clothing marketplace with a live AI try-on studio, retail and wholesale in one storefront.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${mono.variable} antialiased`}
    >
      <body className="bg-paper text-ink">
        <SmoothScroll>
          <Preloader />
          <CursorDot />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
