import weatherData from '../../weatherData.json';
import locationService from './locationService';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WeatherService {
  
  searchWeather = (cityName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const city = weatherData.find(
          item => item.city.toLowerCase() === cityName.toLowerCase()
        );
        
        if (city) {
         
          resolve({
            ...city,
            timestamp: new Date().toISOString(),
          });
        } else {
         
          reject(new Error('City not found'));
        }
      }, 500);
    });
  };

  
  getAllCities = () => {
    return weatherData.map(city => ({
      city: city.city,
      weather: city.weather,
      temperature: city.temperature,
    }));
  };

  
  getWeatherByCoordinates = async (lat, lon) => {
    try {
      const cityName = await locationService.getCityFromCoordinates(lat, lon);
      
      
      const city = weatherData.find(
        item => item.city.toLowerCase() === cityName.toLowerCase()
      );
      
      if (city) {
        return {
          ...city,
          timestamp: new Date().toISOString(),
          isCurrentLocation: true,
        };
      } else {
       
        console.log(`Generating weather data for current location: "${cityName}"`);
        const generatedWeather = this.generateWeatherForCity(cityName);
        return {
          ...generatedWeather,
          timestamp: new Date().toISOString(),
          isCurrentLocation: true,
        };
      }
    } catch (error) {
     
      console.warn(`Reverse geocoding failed, using fallback`);
      const randomCity = weatherData[Math.floor(Math.random() * weatherData.length)];
      return {
        ...randomCity,
        timestamp: new Date().toISOString(),
        isCurrentLocation: true,
        isFallback: true,
      };
    }
  };

  
  getCurrentLocationWeather = async () => {
    try {
      const locationData = await locationService.getCurrentLocationWeather();
      const weatherData = await this.getWeatherByCoordinates(
        locationData.coordinates.latitude, 
        locationData.coordinates.longitude
      );
      
      return {
        ...weatherData,
        coordinates: locationData.coordinates,
        accuracy: locationData.accuracy,
      };
    } catch (error) {
      throw new Error(`Failed to get current location weather: ${error.message}`);
    }
  };


  checkNetworkStatus = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected && netInfo.isInternetReachable;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  };


  cacheWeatherData = async (weatherData) => {
    try {
      const cacheData = {
        ...weatherData,
        cachedAt: new Date().toISOString(),
        isCached: true,
      };
      await AsyncStorage.setItem('cachedWeather', JSON.stringify(cacheData));
      return cacheData;
    } catch (error) {
      console.error('Failed to cache weather data:', error);
      return weatherData;
    }
  };

 
  getCachedWeatherData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('cachedWeather');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        
        const cacheAge = new Date() - new Date(parsed.cachedAt);
        const oneHour = 60 * 60 * 1000;
        
        if (cacheAge < oneHour) {
          return parsed;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached weather data:', error);
      return null;
    }
  };


  searchWeatherOffline = async (cityName) => {
    const isOnline = await this.checkNetworkStatus();
    
    if (isOnline) {
      try {
     
        const weatherData = await this.searchWeather(cityName);
   
        await this.cacheWeatherData(weatherData);
        return weatherData;
      } catch (error) {
   
        const cachedData = await this.getCachedWeatherData();
        if (cachedData && cachedData.city.toLowerCase() === cityName.toLowerCase()) {
          return { ...cachedData, isOffline: true };
        }
        throw error;
      }
    } else {
   
      const cachedData = await this.getCachedWeatherData();
      if (cachedData) {
        return { ...cachedData, isOffline: true };
      }
      throw new Error('No internet connection and no cached data available');
    }
  };

  

  generateWeatherForCity = (cityName) => {
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
      const char = cityName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
  
    const weatherTypes = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
    const weatherType = weatherTypes[Math.abs(hash) % weatherTypes.length];
    
    
    const temperature = 15 + (Math.abs(hash) % 21);
    

    const humidity = 30 + (Math.abs(hash >> 2) % 61);
    
    const windSpeed = 5 + (Math.abs(hash >> 4) % 21);
    
    return {
      city: cityName,
      temperature: temperature,
      weather: weatherType,
      humidity: humidity,
      windSpeed: windSpeed,
      isGenerated: true, 
    };
  };

  getWeatherIcon = (weather) => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sunny')) return '☀️';
    if (weatherLower.includes('cloudy')) return '☁️';
    if (weatherLower.includes('rainy')) return '🌧️';
    if (weatherLower.includes('clear')) return '☀️';
    if (weatherLower.includes('partly')) return '⛅';
    return '🌤️';
  };

  
  getWeatherDescription = (temperature, weather) => {
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
}

export default new WeatherService();
