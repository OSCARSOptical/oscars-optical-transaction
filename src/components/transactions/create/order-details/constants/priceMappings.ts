
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
  "1.56|SV|BB|N/A|Full Rim": { lensCapital: 60, edgingPrice: 30, otherExpenses: 0 },
  "1.56|SV|TRG|N/A|Full Rim": { lensCapital: 70, edgingPrice: 30, otherExpenses: 0 },
  "1.56|SV|BB TRG|N/A|Full Rim": { lensCapital: 85, edgingPrice: 30, otherExpenses: 0 },
  "1.56|KK|UC|N/A|Full Rim": { lensCapital: 55, edgingPrice: 30, otherExpenses: 0 },
  "1.56|KK|MC|N/A|Full Rim": { lensCapital: 65, edgingPrice: 30, otherExpenses: 0 },
  "1.56|KK|BB|N/A|Full Rim": { lensCapital: 80, edgingPrice: 30, otherExpenses: 0 },
  "1.56|KK|TRG|N/A|Full Rim": { lensCapital: 90, edgingPrice: 30, otherExpenses: 0 },
  "1.56|KK|BB TRG|N/A|Full Rim": { lensCapital: 105, edgingPrice: 30, otherExpenses: 0 },
  "1.56|Prog|UC|N/A|Full Rim": { lensCapital: 85, edgingPrice: 30, otherExpenses: 0 },
  "1.56|Prog|MC|N/A|Full Rim": { lensCapital: 95, edgingPrice: 30, otherExpenses: 0 },
  "1.56|Prog|BB|N/A|Full Rim": { lensCapital: 110, edgingPrice: 30, otherExpenses: 0 },
  "1.56|Prog|TRG|N/A|Full Rim": { lensCapital: 120, edgingPrice: 30, otherExpenses: 0 },
  "1.56|Prog|BB TRG|N/A|Full Rim": { lensCapital: 135, edgingPrice: 30, otherExpenses: 0 },
  // Add more combinations for other frame types and refractive indexes
};

export const getPricesForCombination = (
  refractiveIndex: string,
  lensType: string,
  lensCoating: string,
  tint: string,
  frameType: string
): { lensCapital: number; edgingPrice: number; otherExpenses: number } => {
  const key = createLookupKey(refractiveIndex, lensType, lensCoating, tint, frameType);
  return PRICE_COMBINATIONS[key] || { lensCapital: 0, edgingPrice: 0, otherExpenses: 0 };
};
