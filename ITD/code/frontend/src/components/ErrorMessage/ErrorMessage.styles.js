import { StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSizes } from '../../styles';

export default StyleSheet.create({
  errorMessage: {
    backgroundColor: colors.errorBackground,
    padding: spacing.md,
    borderRadius: radius.medium,
    marginVertical: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorMessage_text: {
    color: colors.error,
    fontSize: fontSizes.sm,
  },
});
