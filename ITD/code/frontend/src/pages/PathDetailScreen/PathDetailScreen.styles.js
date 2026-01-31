import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  pathDetailScreen_content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  pathDetailScreen_centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pathDetailScreen_message: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
  },
  pathDetailScreen_errorText: {
    color: colors.error,
    fontSize: fontSizes.body,
    marginBottom: spacing.md,
  },
  pathDetailScreen_retryButton: { marginTop: spacing.sm },
  pathDetailScreen_retryText: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  pathDetailScreen_section: {
    marginBottom: spacing.xl,
  },
  pathDetailScreen_title: {
    fontSize: fontSizes.display ?? 24,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_difficulty: {
    fontSize: fontSizes.body,
    color: colors.startPoint,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  pathDetailScreen_distance: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  pathDetailScreen_sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_points: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  pathDetailScreen_description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  pathDetailScreen_waypoint: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  pathDetailScreen_actions: { marginTop: spacing.xl, gap: spacing.md },
  pathDetailScreen_actionButton: { marginBottom: spacing.md },
  pathDetailScreen_cachedBanner: {
    backgroundColor: colors.backgroundSecondary ?? '#f0f0f0',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  pathDetailScreen_cachedText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
});
