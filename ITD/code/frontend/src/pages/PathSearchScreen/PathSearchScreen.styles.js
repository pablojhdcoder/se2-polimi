import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { borderRadius } from '../../styles/spacing';

export default StyleSheet.create({
  pathSearchScreen_searchRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pathSearchScreen_input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  pathSearchScreen_searchButton: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  pathSearchScreen_searchButtonText: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.medium,
  },
  pathSearchScreen_errorBox: {
    backgroundColor: colors.errorBackground,
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
  },
  pathSearchScreen_errorText: {
    color: colors.error,
    fontSize: fontSizes.body,
  },
  pathSearchScreen_cachedBox: {
    backgroundColor: colors.backgroundSecondary ?? '#f0f0f0',
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
  },
  pathSearchScreen_cachedText: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
  },
  pathSearchScreen_locationButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  pathSearchScreen_locationButtonText: {
    color: colors.primary,
    fontSize: fontSizes.body,
  },
  pathSearchScreen_suggestions: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    maxHeight: 180,
  },
  pathSearchScreen_suggestionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pathSearchScreen_suggestionText: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
  pathSearchScreen_suggestionsLoader: {
    marginVertical: spacing.sm,
  },
});
