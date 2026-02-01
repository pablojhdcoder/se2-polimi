import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { borderRadius } from '../../styles/spacing';
import { shadows } from '../../styles/theme';

const BOTTOM_CARD_MARGIN_H = spacing.lg;
const BOTTOM_CARD_PADDING = spacing.lg;
const BOTTOM_CARD_BOTTOM = spacing.xl;

export default StyleSheet.create({
  // Compact bottom card (title, state/duration, Start Ride, Trip opinions)
  bottomCard: {
    position: 'absolute',
    left: BOTTOM_CARD_MARGIN_H,
    right: BOTTOM_CARD_MARGIN_H,
    bottom: BOTTOM_CARD_BOTTOM,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: BOTTOM_CARD_PADDING,
    ...shadows.card,
    zIndex: 2,
    elevation: 3,
  },
  bottomCardTitle: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bottomCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  bottomCardState: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
  },
  bottomCardStateActive: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  bottomCardDuration: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
  },
  bottomCardActions: {
    gap: spacing.sm,
  },
  bottomCardButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bottomCardButtonPrimary: {
    backgroundColor: colors.primary,
  },
  bottomCardButtonStop: {
    backgroundColor: colors.error,
  },
  bottomCardButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bottomCardButtonDisabled: {
    opacity: 0.7,
  },
  bottomCardButtonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
  },
  bottomCardButtonTextSecondary: {
    color: colors.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.semibold,
  },
});
