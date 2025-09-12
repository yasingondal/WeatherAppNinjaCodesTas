import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeather } from '../context/WeatherContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/colors';

const SettingsScreen = () => {
  const {
    temperatureUnit,
    setTemperatureUnit,
    theme,
    setTheme,
    clearRecentSearches,
    clearFavorites,
    recentSearches,
    favorites,
  } = useWeather();

  const colors = COLORS[theme];

  const handleClearRecentSearches = () => {
    Alert.alert(
      'Clear Recent Searches',
      'Are you sure you want to clear all recent searches?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearRecentSearches },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to clear all favorite cities?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearFavorites },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, onPress, rightComponent, style }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Display
        </Text>
        
        <SettingItem
          title="Temperature Unit"
          subtitle={`Currently using ${temperatureUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}`}
          rightComponent={
            <Switch
              value={temperatureUnit === 'fahrenheit'}
              onValueChange={(value) => setTemperatureUnit(value ? 'fahrenheit' : 'celsius')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />

        <SettingItem
          title="Theme"
          subtitle={`Currently using ${theme === 'light' ? 'Light' : 'Dark'} theme`}
          rightComponent={
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Data
        </Text>
        
        <SettingItem
          title="Recent Searches"
          subtitle={`${recentSearches.length} searches saved`}
          onPress={handleClearRecentSearches}
          rightComponent={
            <Text style={[styles.actionText, { color: colors.error }]}>
              Clear
            </Text>
          }
        />

        <SettingItem
          title="Favorite Cities"
          subtitle={`${favorites.length} cities saved`}
          onPress={handleClearFavorites}
          rightComponent={
            <Text style={[styles.actionText, { color: colors.error }]}>
              Clear
            </Text>
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          About
        </Text>
        
        <SettingItem
          title="App Version"
          subtitle="1.0.0"
        />

        <SettingItem
          title="Weather Data"
          subtitle="Powered by local JSON data"
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Weather App - Built with React Native
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
});

export default SettingsScreen;
