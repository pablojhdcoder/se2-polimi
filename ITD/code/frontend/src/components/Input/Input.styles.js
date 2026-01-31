import { StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  input: {
    marginBottom: spacing.lg,
  },
  input_label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: 6,
  },
  input_field: {
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.medium,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.background,
  },
  input_fieldError: {
    borderColor: colors.error,
  },
  input_errorText: {
    fontSize: fontSizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
