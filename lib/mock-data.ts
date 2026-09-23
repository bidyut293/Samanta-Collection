export type GarmentType =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "cap"
  | "eyewear"
  | "footwear";

export interface PriceTier {
  min_qty: number;
  unit_price: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  garmentType: GarmentType;
  fabric: string;
  gender: "women" | "men" | "unisex";
  basePrice: number;
  compareAt?: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  tryonEnabled: boolean;
  wholesaleEnabled: boolean;
  moq: number;
  tiers: PriceTier[];
  sizePack?: { name: string; ratio: Record<string, number> };
  seller: string;
  tone: [string, string];
  featured?: boolean;
  isNew?: boolean;
}

export const categories = [
  { name: "Outerwear", slug: "outerwear" },
  { name: "Tops", slug: "tops" },
  { name: "Bottoms", slug: "bottoms" },
  { name: "Dresses", slug: "dresses" },
  { name: "Accessories", slug: "accessories" },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "field-overshirt-clay",
    title: "Field Overshirt",
    category: "outerwear",
    garmentType: "outerwear",
    fabric: "Brushed cotton twill",
    gender: "unisex",
    basePrice: 4200,
    compareAt: 5200,
    colors: [
      { name: "Clay", hex: "#b3562e" },
      { name: "Ink", hex: "#1b1b1d" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A boxy, unlined overshirt cut from heavyweight brushed twill. Built to layer over everything from Day 1 to Day 100.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 12,
    tiers: [
      { min_qty: 12, unit_price: 3600 },
      { min_qty: 36, unit_price: 3150 },
      { min_qty: 100, unit_price: 2800 },
    ],
    sizePack: { name: "Standard run", ratio: { S: 1, M: 2, L: 2, XL: 1 } },
    seller: "Studio Loam",
    tone: ["#b3562e", "#241a12"],
    featured: true,
  },
  {
    id: "p2",
    slug: "drape-tee-bone",
    title: "Drape Weight Tee",
    category: "tops",
    garmentType: "top",
    fabric: "220gsm combed cotton",
    gender: "unisex",
    basePrice: 1400,
    colors: [
      { name: "Bone", hex: "#e9e3d6" },
      { name: "Onyx", hex: "#141414" },
      { name: "Moss", hex: "#4a5240" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description:
      "Our heaviest tee. A relaxed block silhouette with a dropped shoulder, garment-washed for a broken-in feel out of the bag.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 24,
    tiers: [
      { min_qty: 24, unit_price: 1100 },
      { min_qty: 72, unit_price: 950 },
      { min_qty: 200, unit_price: 820 },
    ],
    sizePack: { name: "Core run", ratio: { S: 2, M: 3, L: 3, XL: 1 } },
    seller: "Studio Loam",
    tone: ["#c9bfa8", "#2b2820"],
    featured: true,
    isNew: true,
  },
  {
    id: "p3",
    slug: "wide-leg-trouser-ink",
    title: "Wide-Leg Trouser",
    category: "bottoms",
    garmentType: "bottom",
    fabric: "Wool-blend suiting",
    gender: "women",
    basePrice: 3800,
    colors: [
      { name: "Ink", hex: "#17181c" },
      { name: "Taupe", hex: "#a89c8a" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A fluid, floor-skimming trouser with a high rise and a single pleat. Cut to move.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 12,
    tiers: [
      { min_qty: 12, unit_price: 3300 },
      { min_qty: 48, unit_price: 2900 },
    ],
    seller: "Maison Verre",
    tone: ["#8f8879", "#1a1a1c"],
    featured: true,
  },
  {
    id: "p4",
    slug: "silk-slip-dress-merlot",
    title: "Bias Slip Dress",
    category: "dresses",
    garmentType: "dress",
    fabric: "Washed mulberry silk",
    gender: "women",
    basePrice: 6800,
    colors: [
      { name: "Merlot", hex: "#5f1f2b" },
      { name: "Ivory", hex: "#f1ece2" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Cut on the bias for a fluid drape that skims the body. Adjustable straps, a cowl back.",
    tryonEnabled: true,
    wholesaleEnabled: false,
    moq: 1,
    tiers: [],
    seller: "Maison Verre",
    tone: ["#5f1f2b", "#241014"],
    featured: true,
  },
  {
    id: "p5",
    slug: "shell-jacket-storm",
    title: "Packable Shell Jacket",
    category: "outerwear",
    garmentType: "outerwear",
    fabric: "Recycled ripstop nylon",
    gender: "unisex",
    basePrice: 5400,
    colors: [
      { name: "Storm", hex: "#454b52" },
      { name: "Flame", hex: "#c9491f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A three-layer shell that packs into its own chest pocket. Sealed seams, storm flap, one job: keep the weather out.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 20,
    tiers: [
      { min_qty: 20, unit_price: 4600 },
      { min_qty: 60, unit_price: 4050 },
    ],
    sizePack: { name: "Standard run", ratio: { S: 1, M: 2, L: 2, XL: 1 } },
    seller: "Northline Supply",
    tone: ["#454b52", "#15181b"],
  },
  {
    id: "p6",
    slug: "canvas-cap-sand",
    title: "Six-Panel Canvas Cap",
    category: "accessories",
    garmentType: "cap",
    fabric: "Waxed cotton canvas",
    gender: "unisex",
    basePrice: 950,
    colors: [
      { name: "Sand", hex: "#cbb896" },
      { name: "Black", hex: "#111111" },
    ],
    sizes: ["One size"],
    description: "A stiff-brimmed six-panel that softens and shapes to you.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 50,
    tiers: [
      { min_qty: 50, unit_price: 720 },
      { min_qty: 150, unit_price: 620 },
    ],
    seller: "Northline Supply",
    tone: ["#cbb896", "#2c2519"],
  },
  {
    id: "p7",
    slug: "rib-knit-polo-forest",
    title: "Rib Knit Polo",
    category: "tops",
    garmentType: "top",
    fabric: "Merino-cotton rib",
    gender: "men",
    basePrice: 2600,
    colors: [
      { name: "Forest", hex: "#2f4a3a" },
      { name: "Cream", hex: "#efe8d8" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A fine-gauge rib knit polo with a resort collar and mother-of-pearl buttons.",
    tryonEnabled: true,
    wholesaleEnabled: true,
    moq: 24,
    tiers: [{ min_qty: 24, unit_price: 2250 }],
    seller: "Studio Loam",
    tone: ["#2f4a3a", "#12201a"],
    isNew: true,
  },
  {
    id: "p8",
    slug: "pleated-midi-sable",
    title: "Pleated Midi Skirt",
    category: "bottoms",
    garmentType: "bottom",
    fabric: "Plissé polyester",
    gender: "women",
    basePrice: 3200,
    colors: [
      { name: "Sable", hex: "#7a6a52" },
      { name: "Onyx", hex: "#141414" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Knife pleats that hold their line, wash after wash.",
    tryonEnabled: true,
    wholesaleEnabled: false,
    moq: 1,
    tiers: [],
    seller: "Maison Verre",
    tone: ["#7a6a52", "#211c14"],
  },
];

export const tryonBackgrounds = [
  { id: "studio", name: "Studio White", tone: ["#f5f4f1", "#dedad2"] as [string, string] },
  { id: "beach", name: "Beach Golden Hour", tone: ["#f2b979", "#8a4a2b"] as [string, string] },
  { id: "street-night", name: "Street at Night", tone: ["#1a1f2b", "#05070c"] as [string, string] },
  { id: "runway", name: "Runway", tone: ["#0d0d0f", "#2a2a30"] as [string, string] },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}
