/**
 * Spacing: padding and margins for consistent layout.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  full: 9999,
};

/** Alias for borderRadius (small/medium/large/avatar) for component usage. */
export const radius = {
  small: borderRadius.sm,
  medium: borderRadius.md,
  large: borderRadius.lg,
  avatar: borderRadius.full,
};

export default { spacing, borderRadius, radius };
