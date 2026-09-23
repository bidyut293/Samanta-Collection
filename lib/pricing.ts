export interface PriceTier {
  min_qty: number;
  unit_price: number;
}

export function unitPriceFor(
  qty: number,
  basePrice: number,
  tiers: PriceTier[],
) {
  const tier = [...tiers]
    .sort((a, b) => b.min_qty - a.min_qty)
    .find((t) => qty >= t.min_qty);
  return tier ? tier.unit_price : basePrice;
}

export function validateMOQ(qty: number, moq: number) {
  return qty >= moq;
}

export function expandSizePack(
  ratio: Record<string, number>,
  packs: number,
) {
  return Object.fromEntries(
    Object.entries(ratio).map(([size, n]) => [size, n * packs]),
  );
}

export function savingsFor(
  qty: number,
  basePrice: number,
  tiers: PriceTier[],
) {
  const unit = unitPriceFor(qty, basePrice, tiers);
  return Math.max(0, (basePrice - unit) * qty);
}
