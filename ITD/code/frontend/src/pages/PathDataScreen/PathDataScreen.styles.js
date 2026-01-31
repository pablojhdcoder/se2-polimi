import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  pathDataScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  pathDataScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  pathDataScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  pathDataScreen_pathName: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  pathDataScreen_description: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  pathDataScreen_row: { flexDirection: 'row', marginBottom: spacing.sm },
  pathDataScreen_label: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  pathDataScreen_value: { fontSize: fontSizes.body, color: colors.text, flex: 1 },
  pathDataScreen_button: { marginTop: spacing.sm },
  pathDataScreen_back: { marginTop: spacing.lg },
});
