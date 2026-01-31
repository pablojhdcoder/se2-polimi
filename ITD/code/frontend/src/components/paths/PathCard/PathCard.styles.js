import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, fontSizes, fontWeights } from '../../../styles';

export default StyleSheet.create({
  pathCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.medium,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: 6,
    ...shadows.cardLight,
  },
  pathCard_title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pathCard_description: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  pathCard_meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pathCard_metaText: {
    fontSize: fontSizes.xs,
    color: colors.start,
    fontWeight: fontWeights.medium,
  },
  pathCard_points: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
