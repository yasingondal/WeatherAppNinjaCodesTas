import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/colors';

const ToggleSwitch = ({ 
  value, 
  onValueChange, 
  leftLabel = 'Celsius', 
  rightLabel = 'Fahrenheit',
  style,
  theme = 'light'
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const colors = COLORS[theme];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    onValueChange(!value);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50], 
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.text }]}>Temperature Unit</Text>
      
      <TouchableOpacity 
        onPress={handlePress}
        style={[styles.switchContainer, { backgroundColor: colors.border }]}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.switch, 
            { 
              backgroundColor: colors.surface,
              transform: [{ translateX }],
            }
          ]}
        />
        
        <View style={styles.labelsContainer}>
          <Text 
            style={[
              styles.switchLabel, 
              { 
                color: !value ? colors.text : colors.textSecondary,
                fontWeight: !value ? '600' : '400',
              }
            ]}
          >
            {leftLabel}
          </Text>
          <Text 
            style={[
              styles.switchLabel, 
              { 
                color: value ? colors.text : colors.textSecondary,
                fontWeight: value ? '600' : '400',
              }
            ]}
          >
            {rightLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  switchContainer: {
    width: 100,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    position: 'relative',
  },
  switch: {
    width: 48,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    position: 'absolute',
    zIndex: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.sm,
    zIndex: 0,
  },
  switchLabel: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    flex: 1,
  },
});

export default ToggleSwitch;
