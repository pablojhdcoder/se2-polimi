# Best Bike Paths (BBP) - Full Project

Bike route recommendation system based on microservices with a React Native mobile app.

## Project Description

Best Bike Paths is an application that allows users to:
- Register and share bike routes
- Search for the best routes according to different criteria
- Record personal trips with automatic detection
- Rate and review routes
- Detect obstacles during the trip
- Get recommendations based on sensor data and user ratings

## Architecture

The project follows a microservices architecture:

- **Backend**: Express.js with multiple microservices
- **Frontend**: React Native (Expo) for iOS and Android
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** and **Docker Compose**
- **Git**

For mobile development:
- **Expo CLI** (installed automatically with npm)
- **Xcode** (for iOS, macOS only)
- **Android Studio** (for Android)

## Installation

### Option 1: Automatic Script (Recommended)

Run the setup script:

```powershell
.\setup.ps1
```

This script:
1. Verifies required installations
2. Checks that `.env` files exist (backend and frontend are pre-configured)
3. Installs backend and frontend dependencies
4. Starts Docker services

### Option 2: Manual Installation

#### 1. Environment Variables

The backend and frontend `.env` files are already configured in the project. If you need to change them, edit `backend\.env` and `frontend\.env` with your settings.

#### 2. Start Docker Services

```powershell
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- RabbitMQ on port 5672 (Management UI on 15672)

#### 3. Install Backend Dependencies

```powershell
cd backend
npm install
```

#### 4. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

## Useful Commands

### Docker

```powershell
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Development with hot-reload
docker-compose -f docker-compose.dev.yml up
```

### Backend

```powershell
cd backend

# Development
npm run dev

# Production
npm start

# Tests
npm test
npm run test:watch
npm run test:coverage

# Migrations
npm run migrate
```

### Frontend

```powershell
cd frontend

# Start Expo
npm start

# Android
npm run android

# iOS (macOS only)
npm run ios

# Tests
npm test
npm run test:watch
```

## Project Structure

```
code/
├── backend/                    # Backend with Express.js
│   ├── src/
│   │   ├── services/           # Microservices
│   │   │   ├── user-management/
│   │   │   ├── trip-management/
│   │   │   ├── path-management/
│   │   │   ├── path-search/
│   │   │   ├── rating/
│   │   │   ├── sensor-processing/
│   │   │   └── information-merging/
│   │   ├── api-gateway/        # API Gateway
│   │   ├── repositories/       # DB repositories
│   │   ├── models/             # Data models
│   │   ├── utils/              # Utilities
│   │   ├── config/             # Configuration
│   │   └── app.js              # Main application
│   ├── tests/                  # Integration tests
│   ├── migrations/             # DB migrations
│   └── docker/                 # Service-specific Dockerfiles
│
├── frontend/                   # React Native app
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/             # Screens
│   │   ├── services/          # API services
│   │   ├── utils/             # Utilities
│   │   ├── navigation/       # Navigation
│   │   ├── storage/          # Local storage
│   │   └── sensors/          # Sensor Manager
│   └── App.js
│
├── docker-compose.yml         # Services: PostgreSQL, Redis, RabbitMQ
├── docker-compose.dev.yml     # Development with hot-reload
└── setup.ps1                  # Initial setup script
```

## Services and Ports

| Service | Port | Description |
|---------|------|-------------|
| Backend API | 3000 | Main REST API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ Management | 15672 | Management UI (user: guest, password: guest) |

## Development

### Backend

The backend is structured in microservices. Each service has its own business logic and communicates through the API Gateway.

### Frontend

The mobile app uses React Native with Expo. The SensorManager handles access to GPS, accelerometer and gyroscope.

## Testing

### Backend

Tests use Jest and Supertest:

```powershell
cd backend
npm test
```

### Frontend

Tests use Jest and React Native Testing Library:

```powershell
cd frontend
npm test
```

## Contributing

1. Create a branch for your feature
2. Make your changes
3. Ensure tests pass
4. Create a Pull Request

## License

ISC

## Authors

BBP Team - Software Engineering 2 Project
