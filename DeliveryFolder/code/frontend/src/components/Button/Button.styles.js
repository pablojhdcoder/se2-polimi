import { StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.accent,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_disabled: {
    opacity: 0.6,
  },
  button_text: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  button_text_primary: {
    color: colors.textInverse,
  },
  button_text_secondary: {
    color: colors.textInverse,
  },
  button_text_outline: {
    color: colors.primary,
  },
  button_loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
