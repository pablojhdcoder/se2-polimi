import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { borderRadius } from '../../styles/spacing';
import { shadows } from '../../styles/theme';

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
    paddingVertical: spacing.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    ...shadows.card,
  },
  searchBarIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchBarPlaceholder: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
  },
});
