import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useWeather } from '../context/WeatherContext';
import { COLORS, FONT_SIZES } from '../constants/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WeatherDetailsScreen from '../screens/WeatherDetailsScreen';

const TabNavigator = () => {
  const { theme } = useWeather();
  const colors = COLORS[theme];
  const [activeTab, setActiveTab] = useState('Home');
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [selectedWeatherData, setSelectedWeatherData] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleWeatherPress = (weatherData) => {
    setSelectedWeatherData(weatherData);
    setShowWeatherDetails(true);
  };

  const handleBack = () => {
    setShowWeatherDetails(false);
    setSelectedWeatherData(null);
  };

  const renderScreen = () => {
    if (showWeatherDetails) {
      return <WeatherDetailsScreen weatherData={selectedWeatherData} onBack={handleBack} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <HomeScreen onWeatherPress={handleWeatherPress} />;
      case 'Favorites':
        return <FavoritesScreen onWeatherPress={handleWeatherPress} />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen onWeatherPress={handleWeatherPress} />;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {!keyboardVisible && (
        <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('Home')}
          >
            <TabIcon icon="🏠" color={activeTab === 'Home' ? colors.primary : colors.textSecondary} size={24} />
            <Text style={[styles.tabLabel, { color: activeTab === 'Home' ? colors.primary : colors.textSecondary }]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('Favorites')}
          >
            <TabIcon icon="⭐" color={activeTab === 'Favorites' ? colors.primary : colors.textSecondary} size={24} />
            <Text style={[styles.tabLabel, { color: activeTab === 'Favorites' ? colors.primary : colors.textSecondary }]}>
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('Settings')}
          >
            <TabIcon icon="⚙️" color={activeTab === 'Settings' ? colors.primary : colors.textSecondary} size={24} />
            <Text style={[styles.tabLabel, { color: activeTab === 'Settings' ? colors.primary : colors.textSecondary }]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const TabIcon = ({ icon, color, size }) => {
  return (
    <Text style={{ fontSize: size, color }}>
      {icon}
    </Text>
  );
};

const AppNavigator = () => {
  return <TabNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default AppNavigator;
