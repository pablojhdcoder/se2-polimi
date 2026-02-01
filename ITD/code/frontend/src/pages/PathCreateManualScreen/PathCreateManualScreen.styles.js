import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../../styles';
import { borderRadius } from '../../styles/spacing';

export default StyleSheet.create({
  pathCreateManualScreen_mapWrap: {
    height: 240,
    width: '100%',
  },
  pathCreateManualScreen_map: {
    ...StyleSheet.absoluteFillObject,
  },
  pathCreateManualScreen_scroll: { flex: 1 },
  pathCreateManualScreen_content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  pathCreateManualScreen_label: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  pathCreateManualScreen_input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  pathCreateManualScreen_textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pathCreateManualScreen_difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pathCreateManualScreen_chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  pathCreateManualScreen_chipSelected: {
    backgroundColor: colors.primary,
  },
  pathCreateManualScreen_chipText: {
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  pathCreateManualScreen_chipTextSelected: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  pathCreateManualScreen_errorBox: {
    backgroundColor: colors.errorBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  pathCreateManualScreen_errorText: {
    color: colors.error,
    fontSize: fontSizes.body,
  },
  pathCreateManualScreen_submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  pathCreateManualScreen_submitButtonDisabled: {
    opacity: 0.6,
  },
  pathCreateManualScreen_submitText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semibold,
  },
  pathCreateManualScreen_cancelButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  pathCreateManualScreen_cancelText: {
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
  },
  pathCreateManualScreen_suggestions: {
    marginTop: spacing.xs,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    maxHeight: 180,
  },
  pathCreateManualScreen_suggestionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pathCreateManualScreen_suggestionText: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
  pathCreateManualScreen_locationButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  pathCreateManualScreen_locationButtonText: {
    color: colors.primary,
    fontSize: fontSizes.body,
  },
  pathCreateManualScreen_calcButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  pathCreateManualScreen_calcButtonText: {
    color: colors.white,
    fontSize: fontSizes.body,
  },
  pathCreateManualScreen_publishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  pathCreateManualScreen_publishLabel: {
    fontSize: fontSizes.body,
    color: colors.text,
    flex: 1,
  },
});
