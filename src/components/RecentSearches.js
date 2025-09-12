import React, { memo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/colors';

const RecentSearches = ({ 
  searches, 
  onSearchPress, 
  onClearAll,
  theme = 'light',
  style 
}) => {
  const colors = COLORS[theme];

  const renderSearchItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.searchItem, { borderBottomColor: colors.border }]}
      onPress={() => onSearchPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.searchInfo}>
        <Text style={[styles.cityName, { color: colors.text }]}>
          {item.city}
        </Text>
        <Text style={[styles.weatherInfo, { color: colors.textSecondary }]}>
          {item.weather} • {Math.round(item.temperature)}°C
        </Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textSecondary }]}>
        →
      </Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>
        Recent Searches
      </Text>
      {searches.length > 0 && (
        <TouchableOpacity onPress={onClearAll}>
          <Text style={[styles.clearAll, { color: colors.primary }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No recent searches
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        Search for a city to see it here
      </Text>
    </View>
  );

  if (searches.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <ListHeader />
        <EmptyComponent />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={searches}
        renderItem={renderSearchItem}
        keyExtractor={(item, index) => `${item.city}-${index}`}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  clearAll: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: SPACING.lg,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  searchInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  weatherInfo: {
    fontSize: FONT_SIZES.sm,
  },
  arrow: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
  },
});

export default memo(RecentSearches);
