import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const LoadingSpinner = ({ 
  size = 'large', 
  color, 
  text, 
  theme = 'light',
  style 
}) => {
  const colors = COLORS[theme];
  const spinnerColor = color || colors.primary;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text style={[styles.text, { color: colors.text }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
