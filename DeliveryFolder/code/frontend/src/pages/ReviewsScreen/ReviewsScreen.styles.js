import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  reviewsScreen_listContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  reviewsScreen_reviewCard: { marginBottom: spacing.md },
  reviewsScreen_reviewTitle: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  reviewsScreen_reviewText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  reviewsScreen_reviewMeta: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
  },
  reviewsScreen_empty: { padding: spacing.xl, alignItems: 'center' },
  reviewsScreen_emptyText: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
  },
  reviewsScreen_retry: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  reviewsScreen_retryText: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
});
