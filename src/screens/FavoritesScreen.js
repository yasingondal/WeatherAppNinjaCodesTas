import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherCard from '../components/WeatherCard';
import { useWeather } from '../context/WeatherContext';
import { COLORS, FONT_SIZES, SPACING } from '../constants/colors';

const FavoritesScreen = ({ onWeatherPress }) => {
  const { favorites, removeFavorite, theme } = useWeather();
  const [refreshing, setRefreshing] = useState(false);

  const handleRemoveFavorite = (cityName) => {
    Alert.alert(
      'Remove Favorite',
      `Are you sure you want to remove ${cityName} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => removeFavorite(cityName)
        },
      ]
    );
  };

  const handleWeatherPress = (weatherData) => {
    onWeatherPress && onWeatherPress(weatherData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderFavoriteItem = ({ item }) => (
    <WeatherCard
      weatherData={item}
      onPress={() => handleWeatherPress(item)}
      showFavorite={true}
      theme={theme}
      style={styles.favoriteCard}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: COLORS[theme].textSecondary }]}>
        ⭐
      </Text>
      <Text style={[styles.emptyTitle, { color: COLORS[theme].text }]}>
        No Favorites Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: COLORS[theme].textSecondary }]}>
        Add cities to your favorites by tapping the star icon on weather cards
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: COLORS[theme].text }]}>
        Favorite Cities
      </Text>
      <Text style={[styles.subtitle, { color: COLORS[theme].textSecondary }]}>
        {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
      </Text>
    </View>
  );

  const colors = COLORS[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.city}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer
        ]}
      />
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  favoriteCard: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: FONT_SIZES.xxxxl,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FavoritesScreen;
