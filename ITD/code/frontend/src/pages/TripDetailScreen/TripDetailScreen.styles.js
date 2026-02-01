import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../styles';

export default StyleSheet.create({
  tripDetail_content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  tripDetail_section: {
    marginBottom: spacing.lg,
  },
  tripDetail_label: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  tripDetail_value: {
    fontSize: fontSizes.body,
    color: colors.text,
    fontWeight: fontWeights.medium,
  },
  tripDetail_listItem: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
