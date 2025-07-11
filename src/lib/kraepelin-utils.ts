/**
 * Validates a Kraepelin test answer
 * 
 * Checks if the provided answer matches the correct result of adding two numbers
 * using Kraepelin arithmetic rules (modulo 10).
 * 
 * @param a - First number to add
 * @param b - Second number to add  
 * @param answer - The user's answer to validate
 * @returns True if the answer is correct, false otherwise
 * 
 * @example
 * ```typescript
 * validateAnswer(7, 8, 5); // Returns true (7+8=15, 15%10=5)
 * validateAnswer(3, 4, 7); // Returns true (3+4=7)
 * validateAnswer(9, 9, 8); // Returns true (9+9=18, 18%10=8)
 * validateAnswer(5, 3, 9); // Returns false (5+3=8, not 9)
 * ```
 */
export function validateAnswer(a: number, b: number, answer: number): boolean {
  const correctAnswer = plusKraepelin(a, b);
  return answer === correctAnswer;
}

/**
 * Performs Kraepelin arithmetic addition
 * 
 * Adds two single-digit numbers and returns the units digit of the result.
 * This is the core calculation method used in Kraepelin concentration tests.
 * 
 * @param a - First single-digit number (0-9)
 * @param b - Second single-digit number (0-9)
 * @returns The units digit of the sum (0-9)
 * 
 * @example
 * ```typescript
 * plusKraepelin(3, 4); // Returns 7
 * plusKraepelin(7, 8); // Returns 5 (15 % 10)
 * plusKraepelin(9, 9); // Returns 8 (18 % 10)
 * plusKraepelin(0, 5); // Returns 5
 * ```
 * 
 * @see {@link https://en.wikipedia.org/wiki/Kraepelin_test} for test background
 */
export function plusKraepelin(a: number, b: number): number {
  return Math.floor((a + b) % 10);
}
