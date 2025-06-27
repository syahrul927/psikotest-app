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
export function IstIQ(input: number): number | null {
  // Mapping table: [IST Score, IQ Equivalent]
  // Based on standardized psychological testing conversion tables
  const mappings: [number, number][] = [
    [140, 160],   // Superior intelligence
    [139, 158.5],
    [138, 157],
    [137, 155.5],
    [136, 154],
    [135, 152.5],
    [134, 151],
    [133, 149.5],
    [132, 148],
    [131, 146.5],
    [130, 145],   // Very superior
    [129, 143.5],
    [128, 142],
    [127, 140.5],
    [126, 139],
    [125, 137.5],
    [124, 136],
    [123, 134.5],
    [122, 133],
    [121, 133],
    [120, 130],   // Superior
    [119, 128.5],
    [118, 127],
    [117, 125.5],
    [116, 124],
    [115, 122.5],
    [114, 121],
    [113, 119.5],
    [112, 118],
    [111, 116.5],
    [110, 115],   // High average
    [109, 113.5],
    [108, 112],
    [107, 110.5],
    [106, 109],
    [105, 107.5],
    [104, 106],
    [103, 104.5],
    [102, 103],
    [101, 101.5],
    [100, 100],   // Average
    [99, 98.5],
    [98, 97],
    [97, 95.5],
    [96, 94],
    [95, 92.5],
    [94, 91],
    [93, 89.5],
    [92, 88],
    [91, 86.5],
    [90, 85],     // Low average
    [89, 83.5],
    [88, 82],
    [87, 80.5],
    [86, 79],
    [85, 77.5],
    [84, 76],
    [83, 74.5],
    [82, 73],
    [81, 71.5],
    [80, 70],     // Borderline
    [79, 68.5],
    [78, 67],
    [77, 65.5],
    [0, 64],      // Below 77 maps to minimum IQ of 64
  ];

  // Validate input
  if (input < 0) {
    return null;
  }

  // Find the appropriate IQ mapping
  for (const [threshold, result] of mappings) {
    if (input >= threshold) {
      return result;
    }
  }

  return null; // Should not reach here with valid mappings
}
