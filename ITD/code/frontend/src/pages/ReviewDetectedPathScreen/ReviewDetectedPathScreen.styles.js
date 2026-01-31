import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  reviewScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  reviewScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  reviewScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  reviewScreen_description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  reviewScreen_sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reviewScreen_pointsInfo: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  reviewScreen_obstacleList: { marginBottom: spacing.xl },
  reviewScreen_obstacleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
  },
  reviewScreen_obstacleText: {
    fontSize: fontSizes.body,
    color: colors.text,
    flex: 1,
  },
  reviewScreen_obstacleRemove: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  reviewScreen_removeButtonText: {
    fontSize: fontSizes.small,
    color: colors.error,
    fontWeight: fontWeights.semibold,
  },
  reviewScreen_buttons: { gap: spacing.md, marginTop: spacing.lg },
  reviewScreen_button: { marginBottom: spacing.sm },
});
