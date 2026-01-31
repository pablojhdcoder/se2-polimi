import { StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights } from '../../styles';

export default StyleSheet.create({
  avatar: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatar_text: {
    fontSize: fontSizes.large,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
});
