import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  tripRecordingScreen_content: { padding: spacing.xl, paddingBottom: 48 },
  tripRecordingScreen_card: { padding: spacing.xl, marginBottom: spacing.lg },
  tripRecordingScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  tripRecordingScreen_stateLabel: {
    fontSize: fontSizes.large,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tripRecordingScreen_trackInfo: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  tripRecordingScreen_savedMessage: {
    fontSize: fontSizes.body,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  tripRecordingScreen_buttons: { gap: spacing.md },
  tripRecordingScreen_button: { marginTop: spacing.sm },
  tripRecordingScreen_linkButton: { marginTop: spacing.sm },
});
