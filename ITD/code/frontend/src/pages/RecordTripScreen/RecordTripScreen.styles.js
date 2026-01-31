import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { borderRadius } from '../../styles/spacing';

export default StyleSheet.create({
  recordTripScreen_inner: {
    flex: 1,
    padding: spacing.lg,
  },
  recordTripScreen_header: {
    marginBottom: spacing.xl,
  },
  recordTripScreen_title: {
    fontSize: fontSizes.headline,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  recordTripScreen_subtitle: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  recordTripScreen_stateCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordTripScreen_stateLabel: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  recordTripScreen_stateValue: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  recordTripScreen_stateValueActive: {
    color: colors.primary,
  },
  recordTripScreen_duration: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  recordTripScreen_actions: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  recordTripScreen_button: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  recordTripScreen_buttonStart: {
    backgroundColor: colors.primary,
  },
  recordTripScreen_buttonStop: {
    backgroundColor: colors.error,
  },
  recordTripScreen_buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  recordTripScreen_buttonDisabled: {
    opacity: 0.7,
  },
  recordTripScreen_buttonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
  },
  recordTripScreen_buttonTextSecondary: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
  },
  recordTripScreen_eventsSection: {
    flex: 1,
    minHeight: 180,
  },
  recordTripScreen_eventsTitle: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recordTripScreen_eventsList: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordTripScreen_eventsListContent: {
    padding: spacing.md,
  },
  recordTripScreen_eventsEmpty: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
  },
  recordTripScreen_eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  recordTripScreen_eventTime: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  recordTripScreen_eventType: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
});
