import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  reviewDetailScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  reviewDetailScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  reviewDetailScreen_title: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  reviewDetailScreen_pathName: {
    fontSize: fontSizes.large,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reviewDetailScreen_rating: {
    fontSize: fontSizes.medium,
    color: colors.startPoint,
    marginBottom: spacing.md,
  },
  reviewDetailScreen_comment: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  reviewDetailScreen_meta: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  reviewDetailScreen_back: { marginTop: spacing.sm },
});
