import { cn } from "@/lib/utils";
import type { GarmentType } from "@/lib/mock-data";

const PATHS: Record<GarmentType, string> = {
  top: "M35 8 L42 2 L50 6 L58 2 L65 8 L78 20 L68 32 L62 26 L62 92 L38 92 L38 26 L32 32 L22 20 Z",
  bottom:
    "M30 6 H70 L74 92 L54 92 L50 40 L46 92 L26 92 Z",
  dress:
    "M40 6 L46 2 L54 2 L60 6 L66 20 L60 30 L58 24 L64 92 L36 92 L42 24 L40 30 L34 20 Z",
  outerwear:
    "M34 6 L42 0 L50 6 L58 0 L66 6 L82 22 L70 36 L62 28 L62 92 H38 V28 L30 36 L18 22 Z M42 6 V92 M58 6 V92",
  cap: "M20 46 C20 26 34 14 50 14 C66 14 80 26 80 46 L86 50 C88 52 87 56 84 56 L20 56 C16 56 14 52 17 49 Z",
  eyewear:
    "M14 40 H30 A14 14 0 1 0 30 66 H70 A14 14 0 1 0 70 40 H86 M30 53 H70",
  footwear:
    "M10 70 H30 C34 60 42 52 54 50 L80 46 C88 45 92 50 92 56 C92 66 84 72 72 72 H10 Z",
};

const VIEWBOX: Record<GarmentType, string> = {
  top: "0 0 100 100",
  bottom: "0 0 100 100",
  dress: "0 0 100 100",
  outerwear: "0 0 100 100",
  cap: "0 0 100 70",
  eyewear: "0 0 100 90",
  footwear: "0 0 100 80",
};

export function GarmentArt({
  type,
  tone,
  className,
  flip = false,
  grain = true,
}: {
  type: GarmentType;
  tone: [string, string];
  className?: string;
  flip?: boolean;
  grain?: boolean;
}) {
  const uid = `${type}-${tone[0].replace("#", "")}-${tone[1].replace("#", "")}`;
  return (
    <div
      className={cn("relative isolate flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 15%, ${tone[0]} 0%, ${tone[1]} 78%)`,
      }}
    >
      <svg
        viewBox={VIEWBOX[type]}
        className={cn(
          "h-[68%] w-[68%] opacity-90 mix-blend-soft-light",
          flip && "-scale-x-100",
        )}
        fill="none"
        stroke="white"
        strokeWidth={1.5}
      >
        <path d={PATHS[type]} fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.85)" />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {grain && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]">
          <filter id={`n-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#n-${uid})`} />
        </svg>
      )}
    </div>
  );
}
