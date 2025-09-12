import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/colors';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for a city...", 
  isLoading = false,
  style,
  theme = 'light'
}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
    }
  };

  const handleClear = () => {
    setSearchText('');
  };

  const colors = COLORS[theme];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={colors.primary} 
            style={styles.loader}
          />
        ) : (
          <View style={styles.buttonContainer}>
            {searchText.length > 0 && (
              <TouchableOpacity 
                onPress={handleClear}
                style={[styles.clearButton, { backgroundColor: colors.border }]}
              >
                <Text style={[styles.clearText, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleSearch}
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              disabled={!searchText.trim() || isLoading}
            >
              <Text style={[styles.searchText, { color: colors.surface }]}>Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  searchButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 60,
    alignItems: 'center',
  },
  searchText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  loader: {
    marginLeft: SPACING.sm,
  },
});

export default SearchBar;
