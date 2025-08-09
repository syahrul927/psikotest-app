/**
 * Constants for IST Subtest configuration
 */

// Subtest ID configurations
export const SUBTEST_IDS = {
  IMAGE_BASED: [7, 8] as const,
  NUMBER_SELECTION: [5, 6] as const,
  RADIO: [1, 2, 3, 7, 8, 9] as const,
  TEXT: [4] as const,
  MEMORIZATION_REQUIRED: [9] as const,
} as const;

// Number configurations for number selection questions
export const NUMBERS = {
  AVAILABLE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const,
  COUNT: 10 as const,
} as const;

// Timing constants (in seconds)
export const TIMING = {
  DEFAULT_SUBTEST_TIME: 300,
  MEMORIZATION_TIME: 180,
  REDIRECT_DELAY: 5000,
} as const;

// UI and styling constants
export const UI = {
  MOBILE_BREAKPOINT: 'sm',
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PHONE_LENGTH: 1,
  MIN_ADDRESS_LENGTH: 10,
} as const;