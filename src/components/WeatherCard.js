import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/colors';
import { useWeather } from '../context/WeatherContext';

const WeatherCard = ({ 
  weatherData, 
  onPress, 
  showFavorite = true, 
  style,
  animated = false 
}) => {
  const { 
    convertTemperature, 
    getTemperatureUnit, 
    isFavorite, 
    addFavorite, 
    removeFavorite,
    getWeatherBackground,
    theme 
  } = useWeather();

  const colors = COLORS[theme];
  const isFav = isFavorite(weatherData.city);
  const temperature = convertTemperature(weatherData.temperature);
  const unit = getTemperatureUnit();
  const weatherIcon = getWeatherIcon(weatherData.weather);
  const backgroundColor = getWeatherBackground(weatherData.weather);

  const handleFavoritePress = () => {
    if (isFav) {
      removeFavorite(weatherData.city);
    } else {
      addFavorite(weatherData);
    }
  };

  const CardComponent = animated ? Animated.View : View;

  return (
    <TouchableOpacity 
      onPress={() => onPress && onPress(weatherData)}
      activeOpacity={0.8}
    >
      <CardComponent style={[
        styles.container, 
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style
      ]}>
        <View style={[styles.weatherHeader, { backgroundColor }]}>
          <View style={styles.weatherInfo}>
            <View style={styles.cityNameContainer}>
              <Text style={[styles.cityName, { color: colors.surface }]}>
                {weatherData.city}
              </Text>
              {weatherData.isCurrentLocation && (
                <Text style={[styles.locationIndicator, { color: colors.surface }]}>
                  {weatherData.isFallback ? '📍 Default Location' : '📍 Current Location'}
                </Text>
              )}
              {weatherData.isGenerated && (
                <Text style={[styles.locationIndicator, { color: colors.surface }]}>
                  🌤️ Generated Weather
                </Text>
              )}
              {weatherData.isOffline && (
                <Text style={[styles.offlineIndicator, { color: colors.surface }]}>
                  📱 Offline
                </Text>
              )}
              {weatherData.isCached && !weatherData.isOffline && (
                <Text style={[styles.cachedIndicator, { color: colors.surface }]}>
                  💾 Cached
                </Text>
              )}
            </View>
            <Text style={[styles.weatherCondition, { color: colors.surface }]}>
              {weatherData.weather}
            </Text>
          </View>
          <Text style={[styles.weatherIcon, { color: colors.surface }]}>
            {weatherIcon}
          </Text>
        </View>

        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: colors.text }]}>
            {temperature}{unit}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {weatherData.description || getWeatherDescription(weatherData.temperature, weatherData.weather)}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Humidity
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weatherData.humidity}%
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Wind Speed
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {weatherData.windSpeed} km/h
            </Text>
          </View>
        </View>

        {showFavorite && (
          <TouchableOpacity 
            onPress={handleFavoritePress}
            style={[styles.favoriteButton, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.favoriteIcon, { color: isFav ? '#FFD700' : colors.textSecondary }]}>
              {isFav ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}
      </CardComponent>
    </TouchableOpacity>
  );
};

const getWeatherIcon = (weather) => {
  const weatherLower = weather.toLowerCase();
  if (weatherLower.includes('sunny')) return '☀️';
  if (weatherLower.includes('cloudy')) return '☁️';
  if (weatherLower.includes('rainy')) return '🌧️';
  return '🌤️';
};

const getWeatherDescription = (temperature, weather) => {
  const temp = Math.round(temperature);
  const weatherLower = weather.toLowerCase();
  
  if (weatherLower.includes('sunny')) {
    if (temp > 30) return 'Hot and sunny';
    if (temp > 20) return 'Warm and sunny';
    return 'Cool and sunny';
  }
  
  if (weatherLower.includes('cloudy')) {
    if (temp > 25) return 'Warm and cloudy';
    if (temp > 15) return 'Mild and cloudy';
    return 'Cool and cloudy';
  }
  
  if (weatherLower.includes('rainy')) {
    if (temp > 20) return 'Warm rain';
    if (temp > 10) return 'Cool rain';
    return 'Cold rain';
  }
  
  return 'Pleasant weather';
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  weatherInfo: {
    flex: 1,
  },
  cityNameContainer: {
    flexDirection: 'column',
  },
  cityName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  locationIndicator: {
    fontSize: FONT_SIZES.xs,
    opacity: 0.8,
    marginTop: -SPACING.xs,
  },
  offlineIndicator: {
    fontSize: FONT_SIZES.xs,
    opacity: 0.9,
    marginTop: -SPACING.xs,
    fontWeight: '600',
  },
  cachedIndicator: {
    fontSize: FONT_SIZES.xs,
    opacity: 0.8,
    marginTop: -SPACING.xs,
  },
  weatherCondition: {
    fontSize: FONT_SIZES.md,
    opacity: 0.9,
  },
  weatherIcon: {
    fontSize: FONT_SIZES.xxxl,
  },
  temperatureContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  temperature: {
    fontSize: FONT_SIZES.xxxxl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.lg,
  },
});

export default WeatherCard;
