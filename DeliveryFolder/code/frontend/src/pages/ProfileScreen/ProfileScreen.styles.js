import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, radius, shadows } from '../../styles';

export default StyleSheet.create({
  profileScreen_content: {
    padding: spacing.xl,
    paddingBottom: 48,
  },
  profileScreen_sectionTitle: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  profileScreen_userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileScreen_avatarWrap: {
    marginRight: spacing.lg,
  },
  profileScreen_userInfo: {
    flex: 1,
  },
  profileScreen_userName: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileScreen_userEmail: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  profileScreen_optionsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.medium,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.cardLight,
  },
  profileScreen_optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  profileScreen_optionRowLast: {
    borderBottomWidth: 0,
  },
  profileScreen_optionIcon: {
    width: 24,
    marginRight: spacing.md,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  profileScreen_optionLabel: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  profileScreen_optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  profileScreen_editButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  profileScreen_editButtonText: {
    fontSize: fontSizes.small,
    color: colors.textInverse,
  },
  profileScreen_optionValue: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  profileScreen_chevron: {
    fontSize: fontSizes.large,
    color: colors.textMuted,
  },
  profileScreen_logOutButton: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  profileScreen_editCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.medium,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.cardLight,
  },
  profileScreen_editTitle: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  profileScreen_editInput: {
    marginBottom: spacing.md,
  },
  profileScreen_editError: {
    fontSize: fontSizes.small,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  profileScreen_editActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    justifyContent: 'flex-end',
  },
  profileScreen_editActionButton: {
    minWidth: 100,
  },
});
