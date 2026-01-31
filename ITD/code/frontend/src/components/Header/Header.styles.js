import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, spacing } from '../../styles';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header_left: {
    minWidth: 44,
    alignItems: 'flex-start',
  },
  header_backButton: {
    padding: spacing.sm,
  },
  header_backArrow: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: fontWeights.normal,
  },
  header_title: {
    flex: 1,
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  header_right: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  header_avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_avatarText: {
    fontSize: fontSizes.large,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
});
