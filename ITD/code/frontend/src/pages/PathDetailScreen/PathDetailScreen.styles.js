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
    marginBottom: spacing.xs,
  },
  pathDetailScreen_header: {
    marginBottom: spacing.lg,
  },
  pathDetailScreen_byline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pathDetailScreen_bylineText: {
    fontSize: fontSizes.small ?? 13,
    color: colors.textSecondary,
  },
  pathDetailScreen_bylineUser: {
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  pathDetailScreen_badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pathDetailScreen_badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  pathDetailScreen_badgeNeutral: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    backgroundColor: colors.backgroundSecondary ?? '#eee',
  },
  pathDetailScreen_badgePublished: {
    backgroundColor: colors.primary,
  },
  pathDetailScreen_badgeDraft: {
    backgroundColor: colors.textSecondary,
  },
  pathDetailScreen_badgeText: {
    fontSize: fontSizes.small ?? 12,
    color: colors.primaryContrast ?? '#fff',
    fontWeight: fontWeights.semibold,
  },
  pathDetailScreen_badgeTextNeutral: {
    fontSize: fontSizes.small ?? 12,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  pathDetailScreen_badgeTextDraft: {
    fontSize: fontSizes.small ?? 12,
    color: colors.text,
    fontWeight: fontWeights.semibold,
  },
  pathDetailScreen_mapWrap: {
    height: 220,
    width: '100%',
    marginBottom: spacing.md,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pathDetailScreen_map: {
    ...StyleSheet.absoluteFillObject,
  },
  pathDetailScreen_placeLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_placeLoadingText: {
    fontSize: fontSizes.small ?? 13,
    color: colors.textSecondary,
  },
  pathDetailScreen_card: {
    backgroundColor: colors.backgroundSecondary ?? '#f8f8f8',
    padding: spacing.lg,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  pathDetailScreen_routeRow: {
    paddingVertical: spacing.sm,
  },
  pathDetailScreen_routeLabel: {
    fontSize: fontSizes.small ?? 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pathDetailScreen_routeValue: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
  pathDetailScreen_routeDivider: {
    height: 1,
    backgroundColor: colors.border ?? '#e0e0e0',
    marginVertical: spacing.xs,
  },
  pathDetailScreen_statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_weatherTitle: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_stat: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  pathDetailScreen_description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  pathDetailScreen_actions: { marginTop: spacing.lg, gap: spacing.md },
  pathDetailScreen_actionButton: { marginBottom: spacing.sm },
  pathDetailScreen_cachedBanner: {
    backgroundColor: colors.backgroundSecondary ?? '#f0f0f0',
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  pathDetailScreen_cachedText: {
    fontSize: fontSizes.small ?? 13,
    color: colors.textSecondary,
  },
  pathDetailScreen_errorBanner: {
    backgroundColor: colors.errorBackground ?? '#ffebee',
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  pathDetailScreen_row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  pathDetailScreen_label: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  pathDetailScreen_value: {
    fontSize: fontSizes.body,
    color: colors.text,
    flex: 1,
  },
  pathDetailScreen_reviewsSection: {
    marginBottom: spacing.xl,
  },
  pathDetailScreen_reviewsTitle: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  pathDetailScreen_reviewsLoading: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_reviewsError: {
    fontSize: fontSizes.body,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_reviewsEmpty: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_reviewCard: {
    backgroundColor: colors.backgroundSecondary ?? '#f8f8f8',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  pathDetailScreen_reviewMeta: {
    fontSize: fontSizes.small ?? 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  pathDetailScreen_reviewText: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
});
