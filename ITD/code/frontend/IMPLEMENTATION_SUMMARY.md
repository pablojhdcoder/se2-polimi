# Implementation Summary for `src/`

**Best Bike Paths (BBP)** mobile app with React Native + Expo. E2E flows for authentication, paths, trip recording, reviews and statistics.

---

## 1. Navigation (`src/navigation/`)

- **RootNavigator.js**: Decides whether to show **Auth** (no token) or **Main** (with token). While loading state from AsyncStorage it shows `Loading`.
- **AuthStack.js**: Stack for unauthenticated users: **Home** (landing), **Login**, **Register**.
- **MainStack.js**: Main authenticated stack: **MainTabs**, **Home**, **PathList**, **PathDetail**, **PathSearch**, **PathCreateManual**, **PublishPath**, **Reviews**, **ReviewDetail**, **TripStatistics**, **PathData**. Header right with Avatar and link to Paths.
- **MainTabs.js**: Bottom tabs: **Map**, **Ratings** (★), **Create path** (🚴), **Past trips** (📅). Each tab has its stack (Map/PathCreateManual, Reviews/ReviewDetail, PathCreateManual, TripStatistics).
- **AuthContext.js** / **useAuth.js**: Authentication context (token, user, login, logout).

---

## 2. Screens (`src/pages/`)

| Screen | Description |
|--------|-------------|
| **HomeScreen** | Landing (public) or authenticated welcome. |
| **LoginScreen** | Log in. |
| **RegisterScreen** | User registration. |
| **PathListScreen** | Path list. |
| **PathDetailScreen** | Path detail. |
| **PathSearchScreen** | Path search. |
| **PathCreateManualScreen** | Create path manually (also shown in Create path tab). |
| **PublishPathScreen** | Publish path. |
| **ReviewsScreen** | Review list. |
| **ReviewDetailScreen** | Review detail. |
| **TripStatisticsScreen** | Trip statistics. |
| **PathDataScreen** | Path data. |

---

## 3. Components (`src/components/`)

- **Avatar**, **Button**, **Card**, **ErrorMessage**, **Input**, **Loading**.
- **OfflineBanner**, **PendingSyncBanner**: network and sync queue notices.
- **paths/**: **PathCard**, **PathList** (path lists).

---

## 4. Services (`src/services/`)

- **api.js**: Axios client with base URL `EXPO_PUBLIC_API_URL`, interceptors for Bearer token, 401 (clear session), network errors and online/offline callbacks.
- **pathsApi.js**, **reviewsApi.js**, **tripsApi.js**: Paths, reviews and trips APIs.
- **requestWithRetry.js**: Request retries.
- **syncQueueProcessor.js**: Offline sync queue processing.
---

## 5. Storage (`src/storage/`)

- **storageService.js**: Token, user, offline data and sync queue (get/set/clear session, offline data, sync queue).
- **syncQueue.js**: Sync queue structure and operations.
- **constants.js**: Storage keys.

---

## 6. Contexts (`src/contexts/`)

- **NetworkStatusContext.js**: Network status (online/offline), last error and pending sync count. Registers callbacks in `api.js` and processes the queue periodically.

---

## 7. Styles and constants (`src/styles/`, `src/constants/`)

- **theme.js**, **colors.js**, **typography.js**, **spacing.js**.
- **strings.js**: UI text (PATHS, RECORD_TRIP, SEARCH, etc.).

---

## How to run with Expo

1. **Dependencies** (in frontend root):
   ```bash
   cd PabloJose/ITD/code/frontend
   npm install
   ```

2. **Environment variables** (optional): the `.env` file is already configured; edit it to set `EXPO_PUBLIC_API_URL` if the backend is not at `http://localhost:3000/api/v1`.

3. **Start Expo**:
   ```bash
   npm start
   ```
   or:
   ```bash
   npx expo start
   ```

4. A QR code and options will appear in the terminal: **w** (web), **a** (Android), **i** (iOS). On device/emulator scan the QR with Expo Go (Android) or Camera (iOS).

**Note**: For real login you need a backend at the configured URL. Without a backend you will see the login/register screen and app screens, but API calls will fail or return errors until the server is running.
