import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { theme } from '../../styles';

export default StyleSheet.create({
  pathListScreen_errorBox: {
    backgroundColor: colors.errorBackground,
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: theme.borderRadius?.md ?? 8,
  },
  pathListScreen_cachedBox: {
    backgroundColor: colors.backgroundSecondary ?? '#f0f0f0',
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: theme.borderRadius?.md ?? 8,
  },
  pathListScreen_errorText: {
    color: colors.error,
    fontSize: fontSizes.body,
  },
  pathListScreen_retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  pathListScreen_retryText: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  pathListScreen_cachedText: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
  },
  pathListScreen_filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pathListScreen_filterBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius?.md ?? 8,
    backgroundColor: colors.backgroundSecondary ?? '#f0f0f0',
  },
  pathListScreen_filterBtnActive: {
    backgroundColor: colors.primary,
  },
  pathListScreen_filterText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  pathListScreen_filterTextActive: {
    color: colors.primaryContrast ?? '#fff',
    fontWeight: fontWeights.semibold,
  },
});
