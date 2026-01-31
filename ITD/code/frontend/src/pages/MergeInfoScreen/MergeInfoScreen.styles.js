import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  mergeInfoScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  mergeInfoScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  mergeInfoScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  mergeInfoScreen_subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  mergeInfoScreen_mergeId: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  mergeInfoScreen_dataBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  mergeInfoScreen_dataLabel: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  mergeInfoScreen_dataText: {
    fontSize: fontSizes.small,
    color: colors.text,
    fontFamily: 'monospace',
  },
  mergeInfoScreen_placeholder: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  mergeInfoScreen_back: { marginTop: spacing.sm },
});
