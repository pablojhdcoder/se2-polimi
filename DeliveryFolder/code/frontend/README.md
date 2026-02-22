# Best Bike Paths - Frontend (Mobile App)

React Native mobile app for Best Bike Paths built with Expo.

## Description

This mobile application allows users to:
- Register and log in
- Search and view bike paths
- Create paths manually (form with start/end points, distance, difficulty)
- Rate and review paths
- View trip statistics

## Technologies

- **React Native**: Mobile framework
- **Expo**: Tools and services for React Native
- **React Navigation**: Navigation
- **AsyncStorage**: Local storage
- **React Native Sensors**: Sensor access (GPS, accelerometer, gyroscope)
- **Axios**: HTTP client
- **React Native Maps**: Maps (optional)

## File Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/               # Application screens
│   ├── services/              # API services
│   │   └── api.js             # Configured API client
│   ├── utils/                 # Utilities
│   ├── navigation/            # Navigation configuration
│   └── storage/               # Local storage management
├── __tests__/                 # Tests
├── App.js                     # Main component
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler configuration
├── app.json                   # Expo configuration
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI (installed automatically)
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Steps

1. **Install dependencies:**

```bash
npm install
```

2. **Environment variables:** The `.env` file is already configured. If needed, edit `.env` to set `EXPO_PUBLIC_API_URL` (default: http://localhost:3000/api/v1).

3. **Start the application:**

```bash
npm start
```

This will open Expo DevTools. You can:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Scan the QR code with Expo Go app on your physical device

## Usage

### Development

```bash
# Start Expo
npm start

# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Client E2E tests only
npm test -- --testPathPattern="__tests__/e2e"
```

**Client Integration Test Cases** (no real backend):

- **`__tests__/e2e/authFlow.test.js`**: Authentication flow (Home → Login/Register, submit, setSession, validation errors).
- **`__tests__/e2e/pathFlow.test.js`**: Path flow (PathList → PathDetail → PathCreateManual, PublishPath, navigation and mocked APIs).
- **`__tests__/e2e/syncOffline.test.js`**: Sync/offline scenarios (OfflineBanner, PendingSyncBanner, NetworkStatusProvider, mocked sync queue).

Client E2E tests use mocked API, storage and sensors; no server is required.

## Configuration

### Environment Variables

Environment variables must start with `EXPO_PUBLIC_` to be accessible in the app:

- `EXPO_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3000/api/v1)
- `EXPO_PUBLIC_ENV`: Environment (development, production)

### app.json

The `app.json` file contains Expo configuration, including:
- App name
- Icons and splash screen
- Permissions (location, etc.)
- iOS and Android configuration

## Main Components

Reusable UI components live in `src/components/` (Button, Input, Card, Loading, ErrorMessage, OfflineBanner, PendingSyncBanner, Avatar, MapboxMap, PathList, PathCard). Screens use the shared theme from `src/styles/` and strings from `src/constants/strings.js`.

### API Client

The API client (`src/services/api.js`) is configured with:
- Interceptors to add authentication tokens
- Global error handling
- Expired token handling

Usage example:

```javascript
import apiClient from './src/services/api';

// GET request
const response = await apiClient.get('/paths');

// POST request
const newPath = await apiClient.post('/paths', {
  name: 'My Path',
  coordinates: [...]
});
```

## Navigation

Navigation is configured with React Navigation. Screens are registered in `App.js`.

### Adding a New Screen

1. Create the screen component in `src/screens/`
2. Register it in `App.js`:

```javascript
import NewScreen from './src/screens/NewScreen';

// In the Stack.Navigator
<Stack.Screen name="NewScreen" component={NewScreen} />
```

## Permissions

The application requires the following permissions:

- **Location**: To track trips and find paths
- **Background location**: To track trips while the app is in the background

Permissions are requested automatically when using the sensors.

## Testing

Tests use Jest and React Native Testing Library.

### Running Tests

```bash
npm test
```

### Test Structure

```javascript
// __tests__/components/Example.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import ExampleComponent from '../src/components/Example';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ExampleComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

## Build and Deploy

### Development

For development, use Expo Go app or an emulator/simulator.

### Production

To create production builds:

```bash
# Android
expo build:android

# iOS
expo build:ios
```

Or use EAS Build (recommended):

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Troubleshooting

### Backend connection error

- Verify that the backend is running
- Verify `EXPO_PUBLIC_API_URL` in `.env`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` works

### Location permission error

- Verify that permissions are configured in `app.json`
- On Android, check `AndroidManifest.xml` (generated by Expo)
- On iOS, check `Info.plist` (generated by Expo)

### Sensors not available error

- Some sensors are not available in simulators/emulators
- Try on a physical device
- Verify that permissions have been granted

## License

ISC

## Authors

BBP Team - Software Engineering 2 Project
