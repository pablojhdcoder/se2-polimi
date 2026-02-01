import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../../styles';

export default StyleSheet.create({
  tripStatisticsScreen_content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  tripStatisticsScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  tripStatisticsScreen_card: {
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  tripStatisticsScreen_statLabel: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  tripStatisticsScreen_statValue: {
    fontSize: fontSizes.display ?? 28,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  tripStatisticsScreen_button: {
    marginTop: spacing.lg,
  },
  tripStatisticsScreen_sectionTitle: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tripStatisticsScreen_listItem: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.cardLight,
  },
  tripStatisticsScreen_listItemDate: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  tripStatisticsScreen_listItemPoints: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
