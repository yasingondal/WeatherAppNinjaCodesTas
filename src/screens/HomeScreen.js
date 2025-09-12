import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import RecentSearches from '../components/RecentSearches';
import ToggleSwitch from '../components/ToggleSwitch';
import { useWeather } from '../context/WeatherContext';
import weatherService from '../services/weatherService';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const HomeScreen = ({ onWeatherPress }) => {
  const {
    temperatureUnit,
    setTemperatureUnit,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    cachedWeather,
    setCachedWeather,
    isOffline,
    setIsOffline,
    theme,
  } = useWeather();

  const [currentWeather, setCurrentWeather] = useState(cachedWeather);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    
    checkNetworkStatus();
    
   
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const isOnline = await weatherService.checkNetworkStatus();
      setIsOffline(!isOnline);
    } catch (error) {
      console.error('Network check failed:', error);
      setIsOffline(true);
    }
  };

  const handleSearch = async (cityName) => {
    if (!cityName.trim()) return;

    setIsLoading(true);
    setShowRecentSearches(false);

    try {
      const weatherData = await weatherService.searchWeatherOffline(cityName);
      setCurrentWeather(weatherData);
      addRecentSearch(weatherData);
      setCachedWeather(weatherData);
      
      
      if (weatherData.isOffline || weatherData.isCached) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }
    } catch (error) {
      
      const cachedData = await weatherService.getCachedWeatherData();
      if (cachedData) {
        setCurrentWeather({ ...cachedData, isOffline: true });
        setIsOffline(true);
        Alert.alert(
          'Offline Mode',
          'No internet connection. Showing cached weather data.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'City Not Found',
          `Sorry, we don't have weather data for "${cityName}" in our database. Please try searching for New York, London, or Dubai, or use the Current Location button.`,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    // Check if offline first
    const isOnline = await weatherService.checkNetworkStatus();
    
    if (!isOnline) {
      Alert.alert(
        'Internet Required',
        'Please turn on internet connection to get your current location weather.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGettingLocation(true);
    setShowRecentSearches(false);

    try {
      const weatherData = await weatherService.getCurrentLocationWeather();
      setCurrentWeather(weatherData);
      addRecentSearch(weatherData);
      setCachedWeather(weatherData);
      
      
      await weatherService.cacheWeatherData(weatherData);
      
     
      if (weatherData.isOffline || weatherData.isCached) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }
      

      if (weatherData.isFallback) {
        Alert.alert(
          'Location Unavailable',
          `Unable to access your current location (${weatherData.errorReason || 'timeout'}). Showing weather for ${weatherData.city} as a default. You can search for your city manually.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {

      const cachedData = await weatherService.getCachedWeatherData();
      if (cachedData) {
        setCurrentWeather({ ...cachedData, isOffline: true });
        setIsOffline(true);
        Alert.alert(
          'Offline Mode',
          'No internet connection. Showing cached weather data.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Location Error',
          'Unable to get your current location and no cached data available.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsGettingLocation(false);
    }
  };


  const handleRecentSearchPress = (weatherData) => {
    setCurrentWeather(weatherData);
    setShowRecentSearches(false);
  };

  const handleClearRecentSearches = () => {
    Alert.alert(
      'Clear Recent Searches',
      'Are you sure you want to clear all recent searches?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          clearRecentSearches();
        }},
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkNetworkStatus();
    
    if (currentWeather) {
      try {
        const freshData = await weatherService.searchWeatherOffline(currentWeather.city);
        setCurrentWeather(freshData);
        setCachedWeather(freshData);
        
        // Update offline status
        if (freshData.isOffline || freshData.isCached) {
          setIsOffline(true);
        } else {
          setIsOffline(false);
        }
      } catch (error) {
        console.error('Refresh failed:', error);
        // Keep current weather data if refresh fails
        setIsOffline(true);
      }
    }
    
    setRefreshing(false);
  };

  const renderContent = () => {
    if (showRecentSearches && recentSearches.length > 0) {
      return (
        <RecentSearches
          searches={recentSearches}
          onSearchPress={handleRecentSearchPress}
          onClearAll={handleClearRecentSearches}
          theme={theme}
        />
      );
    }

    if (currentWeather) {
      return (
        <WeatherCard
          weatherData={currentWeather}
          onPress={() => onWeatherPress && onWeatherPress(currentWeather)}
          animated={true}
          theme={theme}
        />
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: COLORS[theme].text }]}>
          Welcome to Weather App
        </Text>
        <Text style={[styles.emptySubtitle, { color: COLORS[theme].textSecondary }]}>
          Search for a city to get started
        </Text>
        {isOffline && (
          <View style={styles.offlineContainer}>
            <Text style={[styles.offlineText, { color: COLORS[theme].warning }]}>
              📱 You're currently offline
            </Text>
            <Text style={[styles.offlineSubtext, { color: COLORS[theme].textSecondary }]}>
              Showing cached data when available
            </Text>
          </View>
        )}
      </View>
    );
  };

  const colors = COLORS[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Weather App
            </Text>
            {isOffline && (
              <Text style={[styles.offlineStatus, { color: colors.warning }]}>
                📱 Offline
              </Text>
            )}
          </View>
          <ToggleSwitch
            value={temperatureUnit === 'fahrenheit'}
            onValueChange={(value) => setTemperatureUnit(value ? 'fahrenheit' : 'celsius')}
            theme={theme}
          />
        </View>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            theme={theme}
          />

          {/* Current Location Button */}
          <TouchableOpacity
            style={[styles.currentLocationButton, { backgroundColor: colors.primary }]}
            onPress={handleCurrentLocation}
            disabled={isGettingLocation}
            activeOpacity={0.8}
          >
            <Text style={styles.currentLocationIcon}>📍</Text>
            <Text style={[styles.currentLocationText, { color: colors.surface }]}>
              {isGettingLocation ? 'Getting Location...' : 'Current Location'}
            </Text>
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <FlatList
              data={[]}
              renderItem={() => null}
              ListEmptyComponent={renderContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
  },
  offlineStatus: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  contentContainer: {
    flex: 1,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentLocationIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  currentLocationText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  offlineContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  offlineText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  offlineSubtext: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default HomeScreen;
