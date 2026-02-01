import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../styles';
import { borderRadius } from '../../styles/spacing';

/** Extra padding below status bar for the search bar. Used with safe area top inset. */
export const SEARCH_BAR_TOP_PADDING = spacing.sm;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  mapFullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBarIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchBarPlaceholder: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
  },
  newPathButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPathButtonText: {
    fontSize: fontSizes.medium,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
