import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

class LocationService {
  // Request location permissions
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS permissions are handled in Info.plist
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'WeatherApp needs access to your location to show current weather.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return false;
  };

  // Get current location with retry mechanism
  getCurrentLocation = (retryCount = 0) => {
    return new Promise(async (resolve, reject) => {
      const hasPermission = await this.requestLocationPermission();
      
      if (!hasPermission) {
        reject(new Error('Location permission denied'));
        return;
      }

      const maxRetries = 2;
      const timeout = retryCount === 0 ? 30000 : 15000; // Shorter timeout on retry

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error(`Location error (attempt ${retryCount + 1}):`, error);
          
          // Retry if timeout and we haven't exceeded max retries
          if (error.code === 3 && retryCount < maxRetries) { // TIMEOUT error
            console.log(`Retrying location request (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => {
              this.getCurrentLocation(retryCount + 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          } else {
            reject(error);
          }
        },
        {
          enableHighAccuracy: false, // Changed to false for better compatibility
          timeout: timeout,
          maximumAge: 60000, // Increased maximum age to 1 minute
        }
      );
    });
  };

  // Get city name from coordinates using reverse geocoding
  getCityFromCoordinates = async (latitude, longitude) => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      let cityName = 'Unknown Location';
      
      if (data.city) {
        cityName = data.city;
      } else if (data.locality) {
        cityName = data.locality;
      } else if (data.principalSubdivision) {
        cityName = data.principalSubdivision;
      }
      
      // Map common city names to our weather data cities
      const cityMapping = {
        'New York City': 'New York',
        'NYC': 'New York',
        'Manhattan': 'New York',
        'Brooklyn': 'New York',
        'Queens': 'New York',
        'Bronx': 'New York',
        'Staten Island': 'New York',
        'Greater London': 'London',
        'City of London': 'London',
        'Westminster': 'London',
        'Camden': 'London',
        'Islington': 'London',
        'Hackney': 'London',
        'Tower Hamlets': 'London',
        'Greenwich': 'London',
        'Lewisham': 'London',
        'Southwark': 'London',
        'Lambeth': 'London',
        'Wandsworth': 'London',
        'Merton': 'London',
        'Sutton': 'London',
        'Croydon': 'London',
        'Bromley': 'London',
        'Bexley': 'London',
        'Havering': 'London',
        'Redbridge': 'London',
        'Waltham Forest': 'London',
        'Newham': 'London',
        'Barking and Dagenham': 'London',
        'Haringey': 'London',
        'Enfield': 'London',
        'Barnet': 'London',
        'Harrow': 'London',
        'Brent': 'London',
        'Ealing': 'London',
        'Hounslow': 'London',
        'Richmond upon Thames': 'London',
        'Kingston upon Thames': 'London',
        'Merton': 'London',
        'Sutton': 'London',
        'Croydon': 'London',
        'Bromley': 'London',
        'Bexley': 'London',
        'Havering': 'London',
        'Redbridge': 'London',
        'Waltham Forest': 'London',
        'Newham': 'London',
        'Barking and Dagenham': 'London',
        'Haringey': 'London',
        'Enfield': 'London',
        'Barnet': 'London',
        'Harrow': 'London',
        'Brent': 'London',
        'Ealing': 'London',
        'Hounslow': 'London',
        'Richmond upon Thames': 'London',
        'Kingston upon Thames': 'London',
        'Dubai City': 'Dubai',
        'Dubai Municipality': 'Dubai',
        'Abu Dhabi': 'Dubai',
        'Sharjah': 'Dubai',
        'Ajman': 'Dubai',
        'Fujairah': 'Dubai', 
        'Ras Al Khaimah': 'Dubai',
        'Umm Al Quwain': 'Dubai', 
      };
     
      if (cityMapping[cityName]) {
        return cityMapping[cityName];
      }
      

      return cityName;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'New York'; 
    }
  };

  
  getCurrentLocationWeather = async () => {
    try {
      const location = await this.getCurrentLocation();
      const cityName = await this.getCityFromCoordinates(location.latitude, location.longitude);
      
      return {
        city: cityName,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        accuracy: location.accuracy,
        timestamp: location.timestamp,
        isCurrentLocation: true,
      };
    } catch (error) {
      
      console.warn('Location services failed, using fallback:', error.message);
      
     
      const fallbackCities = [
        { city: 'New York', lat: 40.7128, lon: -74.0060 },
        { city: 'London', lat: 51.5074, lon: -0.1278 },
        { city: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { city: 'Paris', lat: 48.8566, lon: 2.3522 },
        { city: 'Sydney', lat: -33.8688, lon: 151.2093 },
      ];
      
      const randomFallback = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
      
     
      return {
        city: randomFallback.city,
        coordinates: {
          latitude: randomFallback.lat,
          longitude: randomFallback.lon,
        },
        accuracy: 0,
        timestamp: Date.now(),
        isCurrentLocation: true,
        isFallback: true,
        errorReason: error.message,
      };
    }
  };
}

export default new LocationService();
