/**
 * Theme combining DD palette (primary blue, accent orange), typography and spacing.
 * Used by screens and shared BottomNav.
 */

import { colors } from './colors';
import { fontSizes, fontWeights } from './typography';
import { spacing, borderRadius, radius } from './spacing';

/** Shadow presets (subtle floating fields per DD). */
export const shadows = {
  card: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLight: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};

export const theme = {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  radius,
  shadows,
};

// Layout styles for screens (container, card padding, etc.)
export const layoutStyles = {
  screenContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  screenPadding: {
    padding: spacing.xl,
  },
  cardPadding: {
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: spacing.md,
  },
};

export default theme;
