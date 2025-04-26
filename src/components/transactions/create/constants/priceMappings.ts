
interface PriceCombination {
  refractiveIndex: string;
  lensType: string;
  lensCoating: string;
  tint: string;
  frameType: string;
  lensCapital: number;
  edgingPrice: number;
  otherExpenses: number;
}

// Creates a unique key for each combination
const createLookupKey = (
  refractiveIndex: string,
  lensType: string,
  lensCoating: string,
  tint: string,
  frameType: string
) => {
  return `${refractiveIndex}|${lensType}|${lensCoating}|${tint}|${frameType}`;
};

// Sample price combinations (replace with actual data from the table)
const PRICE_COMBINATIONS: Record<string, { lensCapital: number; edgingPrice: number; otherExpenses: number }> = {
  "1.56|SV|UC|N/A|Full Rim": { lensCapital: 35, edgingPrice: 30, otherExpenses: 0 },
  "1.56|SV|MC|N/A|Full Rim": { lensCapital: 45, edgingPrice: 30, otherExpenses: 0 },
  // Add all other combinations from the provided table here
};

export const getPricesForCombination = (
  refractiveIndex: string,
  lensType: string,
  lensCoating: string,
  tint: string,
  frameType: string
) => {
  const key = createLookupKey(refractiveIndex, lensType, lensCoating, tint, frameType);
  return PRICE_COMBINATIONS[key] || { lensCapital: 0, edgingPrice: 0, otherExpenses: 0 };
};
