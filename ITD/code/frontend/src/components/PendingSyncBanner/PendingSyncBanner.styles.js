import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  pendingSyncBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingSyncBanner_text: {
    color: colors.textInverse,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
});
