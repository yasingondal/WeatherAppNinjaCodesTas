# Weather App 🌤️

A beautiful and feature-rich weather application built with React Native, featuring modern UI design, offline capabilities, and comprehensive weather information.

## ✨ Features

### 🌟 Core Features
- **City Search**: Search for weather information by city name
- **Recent Searches**: Quick access to previously searched cities
- **Favorites**: Mark cities as favorites for easy access
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Offline Mode**: Cached weather data for offline viewing
- **Responsive Design**: Optimized for both iOS and Android

### 🎨 UI/UX Features
- **Light/Dark Theme**: Automatic theme switching based on time of day
- **Weather-Specific Backgrounds**: Dynamic colors based on weather conditions
- **Smooth Animations**: Beautiful transitions and loading states
- **Pull-to-Refresh**: Swipe down to refresh weather data
- **Modern Design**: Clean, intuitive interface following iOS/Android guidelines

### 📱 Screens
1. **Home Screen**: Search, recent searches, and current weather display
2. **Favorites Screen**: Manage your favorite cities
3. **Settings Screen**: Customize app preferences
4. **Weather Details Screen**: Detailed weather information with animations

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WeatherApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SearchBar.js
│   ├── WeatherCard.js
│   ├── ToggleSwitch.js
│   ├── RecentSearches.js
│   └── LoadingSpinner.js
├── screens/            # App screens
│   ├── HomeScreen.js
│   ├── FavoritesScreen.js
│   ├── SettingsScreen.js
│   └── WeatherDetailsScreen.js
├── context/            # Global state management
│   └── WeatherContext.js
├── services/           # API and data services
│   └── weatherService.js
├── utils/              # Utility functions
│   └── helpers.js
├── constants/          # App constants
│   └── colors.js
└── navigation/         # Navigation setup
    └── AppNavigator.js
```

## 🛠️ Technologies Used

- **React Native 0.75.5**: Cross-platform mobile development
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **Context API**: Global state management
- **React Native Animatable**: Smooth animations
- **React Native Linear Gradient**: Gradient backgrounds

## 📊 Data Structure

### Weather Data Format
```json
{
  "city": "New York",
  "temperature": 18,
  "weather": "Cloudy",
  "humidity": 65,
  "windSpeed": 10,
  "description": "Partly cloudy with occasional sun",
  "icon": "cloudy"
}
```

## 🎯 Key Features Implementation

### 1. City Search
- Local JSON data simulation
- Real-time search with loading states
- Error handling for invalid cities
- Debounced search for performance

### 2. Recent Searches
- AsyncStorage persistence
- Optimized FlatList rendering
- Quick access to previous searches
- Clear all functionality

### 3. Favorites Management
- Add/remove cities from favorites
- Persistent storage
- Visual feedback with star icons
- Bulk clear functionality

### 4. Temperature Conversion
- Celsius to Fahrenheit conversion
- Global state management
- Real-time updates across all screens
- Formula: °F = (°C × 9/5) + 32

### 5. Theme System
- Automatic light/dark mode based on time
- Manual theme switching
- Weather-specific background colors
- Consistent color scheme across app

### 6. Offline Mode
- Cached weather data
- Network status detection
- Graceful degradation
- Last searched city persistence

## 🎨 Design System

### Colors
- **Light Theme**: Clean whites and grays
- **Dark Theme**: Deep blacks and grays
- **Weather Colors**: Dynamic based on conditions
  - Sunny: Gold (#FFD700)
  - Cloudy: Gray (#708090)
  - Rainy: Blue (#4169E1)

### Typography
- **Headings**: Bold, large sizes
- **Body**: Regular, readable sizes
- **Captions**: Small, secondary information

### Spacing
- Consistent spacing scale (4, 8, 16, 24, 32, 48, 64)
- Responsive padding and margins
- Proper touch targets (minimum 44pt)

## 🔧 Configuration

### Environment Variables
No environment variables required - uses local JSON data.

### Platform-Specific Settings
- iOS: Configured for iOS 12+
- Android: Configured for API level 21+

## 📱 Supported Platforms

- ✅ iOS 12.0+
- ✅ Android API 21+
- ✅ React Native 0.75.5

## 🚀 Performance Optimizations

1. **FlatList Optimization**: Memoized components and optimized rendering
2. **Image Caching**: Efficient image loading and caching
3. **State Management**: Minimal re-renders with Context API
4. **AsyncStorage**: Efficient data persistence
5. **Debounced Search**: Reduced API calls during typing

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📦 Build

### iOS
```bash
# Debug build
npm run ios

# Release build
cd ios && xcodebuild -workspace WeatherApp.xcworkspace -scheme WeatherApp -configuration Release
```

### Android
```bash
# Debug build
npm run android

# Release build
cd android && ./gradlew assembleRelease
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native team for the amazing framework
- React Navigation for smooth navigation
- AsyncStorage for data persistence
- All contributors and testers

## 📞 Support

For support, email support@weatherapp.com or create an issue in the repository.

---

**Built with ❤️ using React Native**