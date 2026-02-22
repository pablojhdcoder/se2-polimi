import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../styles';

export default StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loading_message: {
    marginTop: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});
