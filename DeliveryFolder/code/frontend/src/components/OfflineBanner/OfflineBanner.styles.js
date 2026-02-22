import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  offlineBanner: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBanner_text: {
    color: colors.textInverse,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
});
