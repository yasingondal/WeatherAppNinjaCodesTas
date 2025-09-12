import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeather } from '../context/WeatherContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/colors';

const { width } = Dimensions.get('window');

const WeatherDetailsScreen = ({ weatherData, onBack }) => {
  const { 
    convertTemperature, 
    getTemperatureUnit, 
    isFavorite, 
    addFavorite, 
    removeFavorite,
    getWeatherBackground,
    theme 
  } = useWeather();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const temperature = convertTemperature(weatherData.temperature);
  const unit = getTemperatureUnit();
  const isFav = isFavorite(weatherData.city);
  const backgroundColor = getWeatherBackground(weatherData.weather);
  const colors = COLORS[theme];

  const handleFavoritePress = () => {
    if (isFav) {
      removeFavorite(weatherData.city);
    } else {
      addFavorite(weatherData);
    }
  };

  const getWeatherIcon = (weather) => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sunny')) return '☀️';
    if (weatherLower.includes('cloudy')) return '☁️';
    if (weatherLower.includes('rainy')) return '🌧️';
    return '🌤️';
  };

  const getDetailedDescription = (weather, temperature) => {
    const temp = Math.round(temperature);
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower.includes('sunny')) {
      if (temp > 30) return 'Perfect day for outdoor activities! Remember to stay hydrated and wear sunscreen.';
      if (temp > 20) return 'Great weather for a walk or outdoor dining.';
      return 'Pleasant sunny weather, perfect for light outdoor activities.';
    }
    
    if (weatherLower.includes('cloudy')) {
      if (temp > 25) return 'Warm but overcast. Good weather for outdoor activities without direct sun.';
      if (temp > 15) return 'Mild and cloudy. Comfortable weather for most activities.';
      return 'Cool and overcast. You might want a light jacket.';
    }
    
    if (weatherLower.includes('rainy')) {
      if (temp > 20) return 'Warm rain. Perfect for staying indoors with a good book or movie.';
      if (temp > 10) return 'Cool rain. Great weather for indoor activities.';
      return 'Cold rain. Best to stay warm and dry indoors.';
    }
    
    return 'Enjoy the pleasant weather conditions!';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
 
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => onBack && onBack()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.cityName, { color: colors.text }]}>
              {weatherData.city}
            </Text>
            <Text style={[styles.weatherCondition, { color: colors.textSecondary }]}>
              {weatherData.weather}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleFavoritePress}
            style={[styles.favoriteButton, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.favoriteIcon, { color: isFav ? '#FFD700' : colors.textSecondary }]}>
              {isFav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main weather display */}
        <Animated.View 
          style={[
            styles.weatherCard,
            { 
              backgroundColor,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.weatherIconContainer}>
            <Text style={styles.weatherIcon}>
              {getWeatherIcon(weatherData.weather)}
            </Text>
          </View>
          
          <Text style={[styles.temperature, { color: colors.surface }]}>
            {temperature}{unit}
          </Text>
          
          <Text style={[styles.description, { color: colors.surface }]}>
            {weatherData.description || getDetailedDescription(weatherData.weather, weatherData.temperature)}
          </Text>
        </Animated.View>

        {/* Weather details grid */}
        <Animated.View 
          style={[
            styles.detailsGrid,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.detailIcon, { color: colors.primary }]}>💨</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Wind Speed</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weatherData.windSpeed} km/h
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.detailIcon, { color: colors.primary }]}>💧</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Humidity</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weatherData.humidity}%
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.detailIcon, { color: colors.primary }]}>🌡️</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Temperature</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {temperature}{unit}
            </Text>
          </View>

          <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.detailIcon, { color: colors.primary }]}>☁️</Text>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Condition</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weatherData.weather}
            </Text>
          </View>
        </Animated.View>

        {/* Additional info */}
        <Animated.View 
          style={[
            styles.additionalInfo,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.additionalTitle, { color: colors.text }]}>
            Weather Summary
          </Text>
          <Text style={[styles.additionalText, { color: colors.textSecondary }]}>
            {getDetailedDescription(weatherData.weather, weatherData.temperature)}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  backButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.xl,
  },
  weatherCard: {
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  weatherIconContainer: {
    marginBottom: SPACING.lg,
  },
  weatherIcon: {
    fontSize: 80,
  },
  temperature: {
    fontSize: FONT_SIZES.xxxxl,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    opacity: 0.9,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailCard: {
    width: '95%',
    margin: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: FONT_SIZES.xxl,
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  additionalInfo: {
    paddingHorizontal: SPACING.md,
  },
  additionalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  additionalText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
});

export default WeatherDetailsScreen;
