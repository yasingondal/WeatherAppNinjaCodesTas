import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeatherContext = createContext();


const ACTIONS = {
  SET_TEMPERATURE_UNIT: 'SET_TEMPERATURE_UNIT',
  SET_THEME: 'SET_THEME',
  SET_RECENT_SEARCHES: 'SET_RECENT_SEARCHES',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  SET_FAVORITES: 'SET_FAVORITES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  CLEAR_RECENT_SEARCHES: 'CLEAR_RECENT_SEARCHES',
  SET_CACHED_WEATHER: 'SET_CACHED_WEATHER',
  SET_IS_OFFLINE: 'SET_IS_OFFLINE',
};

// Initial state
const initialState = {
  temperatureUnit: 'celsius',
  theme: 'light', 
  recentSearches: [],
  favorites: [],
  cachedWeather: null,
  isOffline: false,
};

// Reducer
const weatherReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TEMPERATURE_UNIT:
      return { ...state, temperatureUnit: action.payload };
    
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTIONS.SET_RECENT_SEARCHES:
      return { ...state, recentSearches: action.payload };
    
    case ACTIONS.ADD_RECENT_SEARCH:
      const newSearches = [action.payload, ...state.recentSearches.filter(item => item.city !== action.payload.city)].slice(0, 10);
      return { ...state, recentSearches: newSearches };
    
    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    
    case ACTIONS.ADD_FAVORITE:
      if (!state.favorites.find(fav => fav.city === action.payload.city)) {
        return { ...state, favorites: [...state.favorites, action.payload] };
      }
      return state;
    
    case ACTIONS.REMOVE_FAVORITE:
      return { ...state, favorites: state.favorites.filter(fav => fav.city !== action.payload) };
    
    case ACTIONS.CLEAR_FAVORITES:
      return { ...state, favorites: [] };
    
    case ACTIONS.CLEAR_RECENT_SEARCHES:
      return { ...state, recentSearches: [] };
    
    case ACTIONS.SET_CACHED_WEATHER:
      return { ...state, cachedWeather: action.payload };
    
    case ACTIONS.SET_IS_OFFLINE:
      return { ...state, isOffline: action.payload };
    
    default:
      return state;
  }
};


export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);


  useEffect(() => {
    loadStoredData();
    determineTheme();
  }, []);


  useEffect(() => {
    saveToStorage();
  }, [state.temperatureUnit, state.recentSearches, state.favorites, state.cachedWeather]);

  const loadStoredData = async () => {
    try {
      const [temperatureUnit, recentSearches, favorites, cachedWeather] = await Promise.all([
        AsyncStorage.getItem('temperatureUnit'),
        AsyncStorage.getItem('recentSearches'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('cachedWeather'),
      ]);

      if (temperatureUnit) {
        dispatch({ type: ACTIONS.SET_TEMPERATURE_UNIT, payload: temperatureUnit });
      }

      if (recentSearches) {
        dispatch({ type: ACTIONS.SET_RECENT_SEARCHES, payload: JSON.parse(recentSearches) });
      }

      if (favorites) {
        dispatch({ type: ACTIONS.SET_FAVORITES, payload: JSON.parse(favorites) });
      }

      if (cachedWeather) {
        dispatch({ type: ACTIONS.SET_CACHED_WEATHER, payload: JSON.parse(cachedWeather) });
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const saveToStorage = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('temperatureUnit', state.temperatureUnit),
        AsyncStorage.setItem('recentSearches', JSON.stringify(state.recentSearches)),
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites)),
        AsyncStorage.setItem('cachedWeather', JSON.stringify(state.cachedWeather)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const determineTheme = () => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    dispatch({ type: ACTIONS.SET_THEME, payload: isNight ? 'dark' : 'light' });
  };

  
  const setTemperatureUnit = (unit) => {
    dispatch({ type: ACTIONS.SET_TEMPERATURE_UNIT, payload: unit });
  };

  const setTheme = (theme) => {
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
  };

  const addRecentSearch = (weatherData) => {
    dispatch({ type: ACTIONS.ADD_RECENT_SEARCH, payload: weatherData });
  };

  const addFavorite = (weatherData) => {
    dispatch({ type: ACTIONS.ADD_FAVORITE, payload: weatherData });
  };

  const removeFavorite = (cityName) => {
    dispatch({ type: ACTIONS.REMOVE_FAVORITE, payload: cityName });
  };

  const clearFavorites = () => {
    dispatch({ type: ACTIONS.CLEAR_FAVORITES });
  };

  const clearRecentSearches = () => {
    dispatch({ type: ACTIONS.CLEAR_RECENT_SEARCHES });
  };

  const setCachedWeather = (weatherData) => {
    dispatch({ type: ACTIONS.SET_CACHED_WEATHER, payload: weatherData });
  };

  const setIsOffline = (isOffline) => {
    dispatch({ type: ACTIONS.SET_IS_OFFLINE, payload: isOffline });
  };


  const convertTemperature = (celsius) => {
    if (state.temperatureUnit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  const getTemperatureUnit = () => {
    return state.temperatureUnit === 'celsius' ? '°C' : '°F';
  };

  const isFavorite = (cityName) => {
    return state.favorites.some(fav => fav.city === cityName);
  };

  const getWeatherBackground = (weather) => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sunny')) return '#FFD700';
    if (weatherLower.includes('cloudy')) return '#708090';
    if (weatherLower.includes('rainy')) return '#4169E1';
    return '#87CEEB';
  };

  const value = {
    ...state,
    setTemperatureUnit,
    setTheme,
    addRecentSearch,
    addFavorite,
    removeFavorite,
    clearFavorites,
    clearRecentSearches,
    setCachedWeather,
    setIsOffline,
    convertTemperature,
    getTemperatureUnit,
    isFavorite,
    getWeatherBackground,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

// Custom hook to use the context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherContext;
