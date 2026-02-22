import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../../styles';

export default StyleSheet.create({
  pathList_content: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  pathList_centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pathList_message: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
