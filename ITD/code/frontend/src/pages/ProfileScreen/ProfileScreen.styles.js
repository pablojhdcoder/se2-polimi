import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  profileScreen_content: {
    padding: spacing.xl,
    paddingBottom: 48,
  },
  profileScreen_section: {
    marginBottom: spacing.xl,
  },
  profileScreen_sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  profileScreen_card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  profileScreen_statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileScreen_statLabel: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  profileScreen_statValue: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  profileScreen_accountRow: {
    marginBottom: spacing.sm,
  },
  profileScreen_accountLabel: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  profileScreen_accountValue: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
  profileScreen_button: {
    marginTop: spacing.md,
  },
});
