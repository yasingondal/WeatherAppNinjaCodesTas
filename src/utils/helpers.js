
export const formatTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};

export const getTemperatureUnit = (unit) => {
  return unit === 'celsius' ? '°C' : '°F';
};

export const getWeatherIcon = (weather) => {
  const weatherLower = weather.toLowerCase();
  if (weatherLower.includes('sunny')) return '☀️';
  if (weatherLower.includes('cloudy')) return '☁️';
  if (weatherLower.includes('rainy')) return '🌧️';
  if (weatherLower.includes('snowy')) return '❄️';
  if (weatherLower.includes('foggy')) return '🌫️';
  return '🌤️';
};

export const getWeatherBackground = (weather) => {
  const weatherLower = weather.toLowerCase();
  if (weatherLower.includes('sunny')) return '#FFD700';
  if (weatherLower.includes('cloudy')) return '#708090';
  if (weatherLower.includes('rainy')) return '#4169E1';
  if (weatherLower.includes('snowy')) return '#FFFFFF';
  if (weatherLower.includes('foggy')) return '#D3D3D3';
  return '#87CEEB';
};

export const getWeatherDescription = (temperature, weather) => {
  const temp = Math.round(temperature);
  const weatherLower = weather.toLowerCase();
  
  if (weatherLower.includes('sunny')) {
    if (temp > 30) return 'Hot and sunny - perfect for the beach!';
    if (temp > 20) return 'Warm and sunny - great for outdoor activities';
    return 'Cool and sunny - pleasant weather';
  }
  
  if (weatherLower.includes('cloudy')) {
    if (temp > 25) return 'Warm and cloudy - comfortable weather';
    if (temp > 15) return 'Mild and cloudy - good for most activities';
    return 'Cool and cloudy - you might want a light jacket';
  }
  
  if (weatherLower.includes('rainy')) {
    if (temp > 20) return 'Warm rain - perfect for staying indoors';
    if (temp > 10) return 'Cool rain - great weather for indoor activities';
    return 'Cold rain - best to stay warm and dry';
  }
  
  if (weatherLower.includes('snowy')) {
    return 'Snowy weather - perfect for winter activities';
  }
  
  if (weatherLower.includes('foggy')) {
    return 'Foggy conditions - drive carefully';
  }
  
  return 'Pleasant weather conditions';
};

export const getDetailedWeatherDescription = (weather, temperature) => {
  const temp = Math.round(temperature);
  const weatherLower = weather.toLowerCase();
  
  if (weatherLower.includes('sunny')) {
    if (temp > 30) return 'Perfect day for outdoor activities! Remember to stay hydrated and wear sunscreen. The bright sunshine makes it ideal for beach trips or outdoor sports.';
    if (temp > 20) return 'Great weather for a walk or outdoor dining. The warm sunshine creates a pleasant atmosphere for most outdoor activities.';
    return 'Pleasant sunny weather, perfect for light outdoor activities. The cool sunshine makes it comfortable for extended time outside.';
  }
  
  if (weatherLower.includes('cloudy')) {
    if (temp > 25) return 'Warm but overcast. Good weather for outdoor activities without direct sun exposure. The clouds provide natural shade.';
    if (temp > 15) return 'Mild and cloudy. Comfortable weather for most activities. The overcast sky creates even lighting conditions.';
    return 'Cool and overcast. You might want a light jacket. The cloudy sky keeps temperatures moderate.';
  }
  
  if (weatherLower.includes('rainy')) {
    if (temp > 20) return 'Warm rain. Perfect for staying indoors with a good book or movie. The rain creates a cozy atmosphere.';
    if (temp > 10) return 'Cool rain. Great weather for indoor activities like reading, cooking, or watching movies.';
    return 'Cold rain. Best to stay warm and dry indoors. Perfect weather for hot beverages and indoor relaxation.';
  }
  
  if (weatherLower.includes('snowy')) {
    return 'Snowy weather creates a magical winter atmosphere. Perfect for winter sports, building snowmen, or enjoying hot chocolate indoors.';
  }
  
  if (weatherLower.includes('foggy')) {
    return 'Foggy conditions create a mysterious atmosphere. Drive carefully and use headlights. Great weather for atmospheric photography.';
  }
  
  return 'Enjoy the pleasant weather conditions! This is ideal weather for various outdoor and indoor activities.';
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const isNightTime = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour > 18;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateCityName = (cityName) => {
  if (!cityName || cityName.trim().length === 0) {
    return { isValid: false, error: 'City name cannot be empty' };
  }
  
  if (cityName.trim().length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters' };
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(cityName.trim())) {
    return { isValid: false, error: 'City name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};
