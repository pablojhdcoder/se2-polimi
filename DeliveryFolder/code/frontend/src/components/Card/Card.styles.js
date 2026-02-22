import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '../../styles';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.large,
    padding: spacing.lg,
    marginVertical: 6,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
