# Best Bike Paths (BBP)

A bike route recommendation system with a **Node.js/Express backend** (microservices-style) and a **React Native (Expo)** mobile app. Users can discover, record, rate, and share cycling paths.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation (Step by Step)](#installation-step-by-step)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Useful Commands](#useful-commands)
- [Project Structure](#project-structure)
- [Services and Ports](#services-and-ports)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Features

- **User management**: Register, login, JWT-based auth
- **Paths**: Create, search, and publish bike paths with origin/destination and weather snapshot
- **Trips**: Record trips (with or without linking to a path), view history and statistics
- **Ratings and reviews**: Rate paths and leave reviews
- **Offline support**: Frontend can queue actions when offline and sync when back online
- **External integrations**: Weather API (optional), Mapbox for maps (frontend)

---

## Architecture

| Component        | Technology                    |
|-----------------|-------------------------------|
| **Backend**     | Node.js, Express.js           |
| **Frontend**    | React Native (Expo)           |
| **Database**    | PostgreSQL 14                 |
| **Cache**       | Redis 7                       |
| **Message queue** | RabbitMQ 3.12 (AMQP)       |

The backend is organized in a modular way (user-management, path-management, trip-management, rating, etc.) and exposes a single REST API. The mobile app talks to this API and uses local storage and a sync queue for offline behaviour.

---

## Prerequisites

Install the following **before** running the project:

| Tool        | Version / Notes |
|------------|-------------------|
| **Node.js**| ≥ 18.0.0          |
| **npm**    | ≥ 9.0.0           |
| **Docker** | Latest stable     |
| **Docker Compose** | v2+ (e.g. `docker compose` or `docker-compose`) |
| **Git**    | Any recent        |

For the **mobile app**:

- **Expo CLI**: installed via `npm install` in the frontend folder
- **iOS**: Xcode (macOS only)
- **Android**: Android Studio and SDK, or Expo Go app on device

---

## Quick Start

From the **project root** (the folder that contains `backend/`, `frontend/`, and `docker-compose.yml`):

```bash
# 1. Start infrastructure (PostgreSQL, Redis, RabbitMQ)
docker compose up -d

# 2. Backend: install, apply DB schema, run
cd backend
npm install
npm run migrate
npm run dev

# 3. In another terminal: Frontend
cd frontend
npm install
npm start
```

Then open the app in Expo Go (scan QR) or run `npm run android` / `npm run ios` from `frontend/`.

---

## Installation (Step by Step)

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>/code
```

Use the path that contains `backend/`, `frontend/`, and `docker-compose.yml` as the project root.

### 2. Environment files

Create the following files if they are not already present (they are often gitignored).

**Backend** — `backend/.env`:

```env
# Database (must match docker-compose)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bbp_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ (user/pass from docker-compose)
RABBITMQ_URL=amqp://bbp:bbp@localhost:5672

# Server
PORT=3000
NODE_ENV=development

# Auth (change in production)
JWT_SECRET=your_jwt_secret_here

# Optional: Open-Meteo or other weather API
# WEATHER_API_KEY=your_key
```

**Frontend** — `frontend/.env`:

```env
# Backend API (use your machine IP when using a physical device or emulator)
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1

# Mapbox (required for map screens)
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

- On a **physical device** or **Android emulator**, replace `localhost` in `EXPO_PUBLIC_API_URL` with your computer’s IP (e.g. `http://192.168.1.10:3000/api/v1`).
- Get a Mapbox token at [https://account.mapbox.com/](https://account.mapbox.com/).

### 3. Start infrastructure with Docker

From the **project root** (where `docker-compose.yml` is):

```bash
docker compose up -d
```

Wait until PostgreSQL, Redis, and RabbitMQ are healthy (about 10–30 seconds). Optional: check with `docker compose ps`.

### 4. Backend setup

```bash
cd backend
npm install
npm run migrate
```

- `npm run migrate` applies the base schema from `src/config/schema.sql`.  
- If you use extra migration scripts (e.g. in `migrations/`), run them as documented there.

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:3000` (or the port set in `PORT`).

### 5. Frontend setup

Open a **new terminal** from the project root:

```bash
cd frontend
npm install
npm start
```

- Use the Expo CLI to open the app in **Expo Go** (QR code), or run `npm run android` / `npm run ios` from the `frontend` folder.

---

## Environment Variables

| Variable | Where | Description |
|----------|--------|-------------|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Backend | PostgreSQL connection |
| `REDIS_URL` | Backend | Redis connection URL |
| `RABBITMQ_URL` | Backend | RabbitMQ AMQP URL |
| `PORT` | Backend | HTTP server port (default 3000) |
| `JWT_SECRET` | Backend | Secret for JWT signing |
| `WEATHER_API_KEY` | Backend | Optional; for weather features |
| `EXPO_PUBLIC_API_URL` | Frontend | Backend API base URL |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Frontend | Mapbox access token for maps |

Docker defaults (can be overridden in `.env` in project root or in the shell):

- `DB_NAME=bbp_db`, `DB_USER=postgres`, `DB_PASSWORD=postgres`
- `RABBITMQ_USER=bbp`, `RABBITMQ_PASSWORD=bbp`

---

## Running the Project

**Full stack (manual):**

1. **Terminal 1** – Infrastructure:  
   `docker compose up -d`

2. **Terminal 2** – Backend:  
   `cd backend && npm run dev`

3. **Terminal 3** – Frontend:  
   `cd frontend && npm start`  
   Then choose Expo Go, or run `npm run android` / `npm run ios`.

**Backend only with Docker (optional):**

From project root:

```bash
docker compose -f docker-compose.dev.yml up
```

This starts Postgres, Redis, RabbitMQ and the backend container with hot-reload. You still need to run the frontend locally (`cd frontend && npm start`).

---

## Useful Commands

### Docker

```bash
# Start services (detached)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (resets DB and queues)
docker compose down -v

# Dev stack (backend in container with hot-reload)
docker compose -f docker-compose.dev.yml up
```

### Backend (`backend/`)

```bash
npm run dev          # Development with nodemon
npm start            # Production
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Coverage report
npm run migrate      # Apply base schema (schema.sql)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
```

### Frontend (`frontend/`)

```bash
npm start            # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS (macOS only)
npm run web          # Run in browser
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run lint         # ESLint
```

---

## Project Structure

```
code/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Redis, RabbitMQ, schema.sql
│   │   ├── controllers/     # Route handlers
│   │   ├── repositories/    # Data access
│   │   ├── services/        # Business logic (user, path, trip, rating, etc.)
│   │   ├── utils/           # Helpers, auth middleware
│   │   └── app.js           # Express app entry
│   ├── migrations/          # Optional DB migration scripts
│   ├── tests/               # Jest + Supertest tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI
│   │   ├── pages/           # Screens
│   │   ├── services/        # API client, map service
│   │   ├── storage/         # Local storage, sync queue
│   │   ├── styles/          # Theme, colors, spacing
│   │   └── utils/           # Helpers
│   ├── App.js
│   └── package.json
│
├── docker-compose.yml       # PostgreSQL, Redis, RabbitMQ
├── docker-compose.dev.yml   # Same + backend container (dev)
└── README.md                # This file
```

---

## Services and Ports

| Service            | Port  | Description |
|--------------------|-------|-------------|
| Backend API        | 3000  | REST API (run locally or via docker-compose.dev) |
| PostgreSQL         | 5432  | Database |
| Redis              | 6379  | Cache / sessions |
| RabbitMQ AMQP      | 5672  | Message queue |
| RabbitMQ Management| 15672 | Web UI (default user: `bbp`, password: `bbp`) |

---

## Testing

**Backend** (from `backend/`):

```bash
npm test
```

Uses Jest and Supertest. Ensure DB and Redis are reachable (e.g. `docker compose up -d`) or that tests use test config/mocks as in the project.

**Frontend** (from `frontend/`):

```bash
npm test
```

Uses Jest and React Native Testing Library.


 

