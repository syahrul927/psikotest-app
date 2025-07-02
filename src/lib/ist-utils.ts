import { z } from "zod";

/**
 * Converts IST standardized score to IQ equivalent
 *
 * This function maps IST standardized scores (0-140) to IQ equivalents (64-160)
 * based on established psychological testing norms. The mapping follows a
 * standardized conversion table used in intelligence assessment.
 *
 * @param input - The IST standardized score (typically 0-140)
 * @returns The IQ equivalent score (64-160) or null for invalid inputs
 *
 * @example
 * ```typescript
 * const iqScore = IstIQ(120); // Returns 130
 * const lowScore = IstIQ(80);  // Returns 70
 * const invalidScore = IstIQ(-5); // Returns null
 * ```
 *
 * @see {@link https://en.wikipedia.org/wiki/Intelligence_quotient} for IQ scale reference
 */
export function IstIQ(input?: number): number {
  // Clamp values below 0 and above 140
  if (!input) return 0;
  if (input < 0) return 64;
  if (input > 140) return 160;

  const mappings: [number, number][] = [
    [140, 160],
    [139, 158.5],
    [138, 157],
    [137, 155.5],
    [136, 154],
    [135, 152.5],
    [134, 151],
    [133, 149.5],
    [132, 148],
    [131, 146.5],
    [130, 145],
    [129, 143.5],
    [128, 142],
    [127, 140.5],
    [126, 139],
    [125, 137.5],
    [124, 136],
    [123, 134.5],
    [122, 133],
    [121, 133],
    [120, 130],
    [119, 128.5],
    [118, 127],
    [117, 125.5],
    [116, 124],
    [115, 122.5],
    [114, 121],
    [113, 119.5],
    [112, 118],
    [111, 116.5],
    [110, 115],
    [109, 113.5],
    [108, 112],
    [107, 110.5],
    [106, 109],
    [105, 107.5],
    [104, 106],
    [103, 104.5],
    [102, 103],
    [101, 101.5],
    [100, 100],
    [99, 98.5],
    [98, 97],
    [97, 95.5],
    [96, 94],
    [95, 92.5],
    [94, 91],
    [93, 89.5],
    [92, 88],
    [91, 86.5],
    [90, 85],
    [89, 83.5],
    [88, 82],
    [87, 80.5],
    [86, 79],
    [85, 77.5],
    [84, 76],
    [83, 74.5],
    [82, 73],
    [81, 71.5],
    [80, 70],
    [79, 68.5],
    [78, 67],
    [77, 65.5],
    [0, 64],
  ];

  for (const [threshold, result] of mappings) {
    if (input >= threshold) {
      return result;
    }
  }

  return 64; // fallback
}

const answerSchema = z.array(
  z.object({
    score: z.string(),
    data: z.array(z.string()),
  }),
);
export const parseFourthAnswerTemplate = (str?: string) => {
  return str ? answerSchema.parse(JSON.parse(str)) : [];
};

export function classificationCriteriaByIQ(iq?: number) {
  if (!iq) return "Invalid Score";
  if (iq >= 129) {
    return "Very Superior";
  } else if (iq >= 120) {
    return "Superior";
  } else if (iq >= 110) {
    return "High Average";
  } else if (iq >= 90) {
    return "Average";
  } else {
    return "Low Average";
  }
}
export function categorizeIq(iq?: number) {
  if (!iq) return "Invalid score";
  if (iq >= 119) {
    return "Very Superior";
  } else if (iq >= 114) {
    return "Superior";
  } else if (iq >= 107) {
    return "High Average";
  } else if (iq >= 94) {
    return "Average";
  } else {
    return "Low Average";
  }
}

export const getBadgeVariant = (value: string) => {
  switch (value.toLowerCase()) {
    case "low":
      return "destructive";
    case "average":
      return "secondary";
    case "high":
      return "positive";
    case "superior":
      return "positive";
    case "very superior":
      return "positive";
    case "low average":
      return "destructive";
    case "high average":
      return "positiveBlue";
    default:
      return "secondary";
  }
};
