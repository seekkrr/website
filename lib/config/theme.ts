/**
 * Theme Constants - Centralized color and styling tokens
 * Used across the entire application for consistency and maintainability
 */

export const themeColors = {
  // Primary palette
  beige: "var(--color-beige)",
  yellow: "var(--color-yellow-accent)",
  blue: "var(--color-blue-accent)",
  green: "var(--color-green-dark)",
  orange: "var(--color-orange-accent)",

  // For text shadows and effects
  textShadows: {
    yellow: "#FECD36",
    blue: "#8398FF",
    orange: "var(--color-orange-accent)",
  },

  // About page specific colors
  about: {
    yellow: "#FECD36",
    blue: "#8398FF",
  },
};

export const animationDefaults = {
  // Standard animation durations (in ms)
  fast: 200,
  normal: 300,
  slow: 500,

  // Spring animation defaults
  spring: {
    damping: 25,
    stiffness: 300,
  },
};

export const modalDefaults = {
  // Auto-close delays
  autoCloseFast: 4_000,
  autoCloseSlow: 6_000,

  // Exit animation duration
  exitDuration: 300,
};

export const shadowValues = {
  // Profile cards and special elements
  profile: (shadowColor: string) => `4px 4px 0px 0px ${shadowColor}`,

  // Standard modal shadow
  modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};
