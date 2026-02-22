import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  publishPathScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  publishPathScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  publishPathScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  publishPathScreen_subtitle: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  publishPathScreen_input: { marginBottom: spacing.lg },
  publishPathScreen_button: { marginTop: spacing.sm },
  publishPathScreen_success: {
    fontSize: fontSizes.medium,
    color: colors.primary,
    marginTop: spacing.lg,
  },
  publishPathScreen_backButton: { marginTop: spacing.sm },
});
