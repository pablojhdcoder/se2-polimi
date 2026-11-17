<h1 align="center">Best Bike Paths</h1>

<p align="center">
  <strong>A full-stack cycling platform for discovering, creating, publishing and rating bike paths, and for reviewing your trip history.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/RabbitMQ-3.12-FF6600?logo=rabbitmq&logoColor=white" alt="RabbitMQ">
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-repository-structure">Repository structure</a> •
  <a href="#-getting-started">Getting started</a> •
  <a href="#-testing">Testing</a>
</p>

---

## 📖 About

**Best Bike Paths (BBP)** is a mobile cycling platform developed for the **Software Engineering 2** course at **Politecnico di Milano** (A.Y. 2025/2026).

The app helps cyclists find and share bike routes. After signing in, users browse a map, search for paths, create and publish their own routes, rate and review paths, and consult trip statistics. Weather at the origin can be attached automatically when a path is created. The work covers the full course lifecycle: requirements and a formal Alloy model, architectural design, implementation with automated tests, and acceptance testing.

### 🎯 Objectives

- Enable cyclists to store personal routes and publish them so others can view them.
- Let all users browse available paths, including their status and characteristics, and search for paths between two points or by keyword.
- Keep per-user trip statistics and history.
- Complement stored routes with meteorological information.

## 📱 Screenshots

<table>
  <tr>
    <td align="center" width="25%">
      <img src="docs/screenshots/map-home.jpg" width="200" alt="Home map"><br>
      <sub>Home map</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/screenshots/create-path.jpg" width="200" alt="Create path"><br>
      <sub>Create path</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/screenshots/path-detail.jpg" width="200" alt="Path detail"><br>
      <sub>Path detail</sub>
    </td>
    <td align="center" width="25%">
      <img src="docs/screenshots/trip-stats.jpg" width="200" alt="Trip statistics"><br>
      <sub>Trip statistics</sub>
    </td>
  </tr>
</table>

## ✨ Features

### 👤 Accounts and profile

- Registration with name, email and password, and login with JWT (24-hour expiry, password hashing with bcrypt)
- Profile and settings: view activity statistics, edit personal info (name, email, phone number) and log out
- Dicebear avatars in the header and profile

### 🗺️ Path discovery

- Full-screen Mapbox map with a **Search paths** bar and bottom tabs (Map, Ratings, Create path, Paths, Past trips)
- Search by origin and destination, or by keyword; results are drawn on the map and listed in a bottom sheet
- Path list with filters for all paths or the current user's paths, and for published or unpublished routes
- Path detail with start/end markers, published/draft badge, addresses, distance, difficulty, duration, recorded weather, and owner-only publish or unpublish

### 🚴 Path creation and reviews

- Manual path creation: name, start and end points (place search or current location), distance and duration from Mapbox directions, description, difficulty (Easy, Medium, Hard) and an option to publish immediately
- Weather at origin can be filled automatically (temperature, wind, visibility, rain, clouds) via OpenWeatherMap
- Path ratings on a 1–5 scale with written reviews, average rating, and a reviews list and detail screen

### 📊 Trips and offline use

- Trip statistics: total trips, recorded points, total time and a list of past trips, with a trip detail screen
- Offline banners, a pending-sync queue, and cached path data when the server is unreachable

The Implementation and Testing Deliverable lists some planned capabilities as **out of scope** for this release, including automatic trip or obstacle detection, generating a path automatically from a completed trip, turn-by-turn route planning, and email notifications.

## 🛠️ Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React Native 0.81, Expo 54, React 19, JavaScript, React Navigation (stack and bottom tabs), Expo Location, AsyncStorage, Axios, Dicebear, `@rnmapbox/maps` |
| Backend | Node.js 18+ (Docker image uses Node 20), Express 4, `pg`, JWT, bcrypt, Helmet, CORS, Morgan, Axios |
| Data and infra | PostgreSQL 14, Redis 7, RabbitMQ 3.12 (Docker Compose) |
| External services | Mapbox (maps, geocoding and directions), OpenWeatherMap (optional; mock weather is returned if `WEATHER_API_KEY` is unset) |
| Testing and quality | Jest, Supertest, React Native Testing Library, ESLint |

The runnable application is written in JavaScript. Service modules on the backend are organized by domain (user, path, trip, rating and weather) behind a single REST API under `/api/v1`.

## 🏛️ Architecture

The system follows a layered design: a React Native client talks to an Express API; services hold the business logic; repositories access PostgreSQL. Redis stores JWT sessions (24-hour TTL) and live trip coordinates. The backend also connects to RabbitMQ on startup (PostgreSQL, Redis and RabbitMQ are started with Docker Compose).

```
Mobile app (Expo)  →  Express API (/api/v1)  →  PostgreSQL
                         │
                         ├── Redis (sessions, live trip coords)
                         └── OpenWeatherMap / Mapbox (external)
```

Main API routes (auth-protected routes require `Authorization: Bearer <token>`):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (outside `/api/v1`) |
| POST | `/api/v1/auth/register`, `/login` | Register and log in |
| POST | `/api/v1/auth/logout` | Log out (auth) |
| GET / PATCH | `/api/v1/auth/me` | Read or update the current user (auth) |
| GET | `/api/v1/weather` | Weather at coordinates |
| POST / GET | `/api/v1/paths` | Create a path (auth) or list paths |
| GET | `/api/v1/paths/nearby`, `/related`, `/saved`, `/mine`, `/:id` | Nearby, related, saved and own paths, or one path |
| PATCH | `/api/v1/paths/:id` | Update a path, including publish state (auth) |
| POST / DELETE | `/api/v1/paths/:id/save` | Save or unsave a path (auth) |
| GET / POST / DELETE | `/api/v1/ratings` and `/api/v1/reviews` | Ratings and reviews (`/reviews` is an alias of `/ratings`) |
| POST | `/api/v1/trips/manual`, `/automatic` | Start a trip (auth) |
| GET | `/api/v1/trips/me`, `/trips/:id` | List own trips or fetch one (auth) |
| PATCH | `/api/v1/trips/:id/route` | Update the recorded track (auth) |

## 📂 Repository structure

```text
se2-polimi/
├── README.md                    # Repository overview
├── Assignment/                  # Official course assignment briefs (A.Y. 2025/2026)
│   ├── Assignment RDD AY 2025-2026.pdf   # Requirements and design assignment
│   └── Assignment IT 2025-2026.pdf       # Implementation and testing assignment
├── RASD/                        # Requirements Analysis and Specification Document (sources + PDF)
│   ├── DocumentoRASD.tex        # RASD main LaTeX file
│   ├── Chapters/                # Introduction, overall description, requirements, Alloy, effort, references
│   ├── ConfigurationFiles/      # Polimi LaTeX class and preamble
│   ├── Images/                  # UI mockups, use-case/sequence/state diagrams, Alloy instances, Polimi logo
│   ├── BestBikePaths.als        # Formal Alloy model of users, paths, trips and ratings
│   ├── RASD.pdf                 # Compiled RASD
│   ├── compile.ps1, clean.ps1   # Windows scripts to build or clean the PDF
│   └── *.md, DOCUMENT_PREVIEW.txt  # Local notes for LaTeX, Alloy and diagrams
├── DD/                          # Design Document (sources + PDF)
│   ├── DD.tex, Chapters/        # Introduction, architecture, UI design, requirements traceability, implementation/test plan, effort, references
│   ├── ConfigurationFiles/      # Polimi LaTeX class and preamble
│   ├── Images/                  # Architecture, component and deployment diagrams, sequence diagrams, UI mockups
│   ├── DD.pdf                   # Compiled Design Document
│   └── compile.ps1, clean.ps1
├── ITD/                         # Implementation and Testing Deliverable
│   ├── document/                # LaTeX source of the ITD (ITD.tex, Chapters/, Images/, compile/clean scripts)
│   └── code/                    # Application developed with the ITD (backend, frontend, Docker Compose)
│       ├── backend/             # Express API, schema, migrations, tests; also scripts/ (seed and integration helper)
│       ├── frontend/            # Expo app, tests, and internal notes (IMPLEMENTATION_SUMMARY.md, REVIEW.md, VERIFICATION.md)
│       ├── docker-compose.yml   # PostgreSQL, Redis and RabbitMQ
│       └── docker-compose.dev.yml  # Same stack plus the backend container with hot reload
├── ATD/                         # Acceptance Testing Document (sources + PDF)
│   ├── ATD.tex, Chapters/       # Installation notes and acceptance tests of another team's project (see the table below)
│   ├── ConfigurationFiles/, Images/
│   ├── ATD.pdf                  # Compiled ATD
│   └── compile.ps1
└── DeliveryFolder/              # Packaged submission: compiled PDFs, presentation and a copy of the code
    ├── RASD.pdf, DD.pdf, ITD.pdf, ATD.pdf
    ├── Presentation.pdf         # Course presentation of Best Bike Paths
    └── code/                    # Packaged application copy (backend, frontend, Docker Compose)
```

The instructions in [Getting started](#-getting-started) use `DeliveryFolder/code`. They also apply to `ITD/code`, which additionally includes `backend/scripts/seed-demo-data.js` (`npm run seed`).

### Deliverable documents

| Document | Where to find it | What it contains |
|----------|------------------|------------------|
| **RASD** (v1.0, 23 December 2025) | [RASD/RASD.pdf](RASD/RASD.pdf), also [DeliveryFolder/RASD.pdf](DeliveryFolder/RASD.pdf) | Purpose and goals, scope, scenarios, class and state diagrams, product functions, specific requirements (including use cases), and a formal Alloy analysis (source model: [RASD/BestBikePaths.als](RASD/BestBikePaths.als)). |
| **DD** (v1.0, 7 January 2026) | [DD/DD.pdf](DD/DD.pdf), also [DeliveryFolder/DD.pdf](DeliveryFolder/DD.pdf) | Architectural, component, deployment and runtime views, user-interface design, requirements traceability, and the implementation and integration-test plan. |
| **ITD** (v1.0, 1 February 2026) | [DeliveryFolder/ITD.pdf](DeliveryFolder/ITD.pdf) (LaTeX in [ITD/document/](ITD/document/)) | System implementation (design choices, stack, implemented and excluded features, source layout), integration strategy, testing procedure, installation instructions and effort spent. |
| **ATD** (v1.0, 8 February 2026) | [ATD/ATD.pdf](ATD/ATD.pdf), also [DeliveryFolder/ATD.pdf](DeliveryFolder/ATD.pdf) | Acceptance testing of **another team's** Best Bike Paths project (the Errigo–Gholami–Ianosel repository): how that project was installed and the acceptance test cases that were run. It does not describe the code in this repository. |
| **Presentation** | [DeliveryFolder/Presentation.pdf](DeliveryFolder/Presentation.pdf) | Course presentation of the project, the team and the application. |
| **Assignment briefs** | [Assignment/](Assignment/) | Official Software Engineering 2 assignment PDFs for the requirements-and-design (RDD) and implementation-and-testing (IT) parts, A.Y. 2025/2026. |

## 🚀 Getting started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose v2
- A [Mapbox](https://account.mapbox.com/) access token (needed for map screens, geocoding and directions)
- An [OpenWeatherMap](https://openweathermap.org/) API key is optional; without it the backend returns mock weather data

### Install

```bash
git clone https://github.com/pablojhdcoder/se2-polimi.git
cd se2-polimi/DeliveryFolder/code
```

Create the environment files below, then start the infrastructure and the two applications.

### Environment variables

There is no `.env.example` in the repository. Create `backend/.env` and `frontend/.env` (both paths are gitignored).

`backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bbp_db
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://bbp:bbp@localhost:5672
PORT=3000
NODE_ENV=development
JWT_SECRET=
FRONTEND_URL=
WEATHER_API_KEY=
```

`JWT_SECRET` should be set to your own secret (the code falls back to a built-in default if it is omitted). `PORT` defaults to `3000`. `FRONTEND_URL` is used for CORS and defaults to `*`. `WEATHER_API_KEY` is optional.

`frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

On a physical device or the Android emulator, replace `localhost` with your computer's IP (use `http://10.0.2.2:3000/api/v1` on the Android emulator). `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` is read at native prebuild and falls back to `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`.

Docker Compose defaults, which can be overridden in the environment, are `DB_NAME=bbp_db`, `DB_USER=postgres`, `DB_PASSWORD=postgres`, `RABBITMQ_USER=bbp` and `RABBITMQ_PASSWORD=bbp`.

### Run

From `DeliveryFolder/code`:

```bash
docker compose up -d
```

Wait until PostgreSQL, Redis and RabbitMQ are healthy (`docker compose ps`). Then, in one terminal:

```bash
cd backend
npm install
npm run migrate
npm run dev
```

`npm run migrate` applies `src/config/schema.sql` (users, paths, saved paths, ratings and trips). The API listens on `http://localhost:3000`.

In another terminal:

```bash
cd frontend
npm install
npm start
```

Then open the app in Expo Go, or run `npm run android` / `npm run ios` / `npm run web` from `frontend/`.

Optional: `docker compose -f docker-compose.dev.yml up` starts the same infrastructure plus the backend in a container with hot reload (Node 20). The frontend still runs locally.

Useful backend scripts: `npm start` (production), `npm run lint`, `npm run lint:fix`. In `ITD/code/backend` only, `npm run seed` loads demo users and paths.

| Service | Port |
|---------|------|
| Backend API | 3000 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| RabbitMQ AMQP | 5672 |
| RabbitMQ Management UI | 15672 (user `bbp`, password `bbp`) |

## 🧪 Testing

Backend tests use Jest and Supertest. Redis, RabbitMQ and the weather service are mocked in `tests/jest.setup.js`. Repository tests talk to the database, so start the infrastructure first (`docker compose up -d` from `DeliveryFolder/code`).

```bash
cd DeliveryFolder/code/backend
npm test
npm run test:watch
npm run test:coverage
```

Coverage includes the health endpoint, Redis helpers, auth/trip HTTP routes, auth/user/path/trip/weather services, and the user and trip repositories.

Frontend tests use Jest and React Native Testing Library, with the API, storage and sensors mocked (no running backend required):

```bash
cd DeliveryFolder/code/frontend
npm test
npm run test:watch
npm run test:coverage
```

They cover base UI components and banners, authentication screens, path and activity screens, and app-level flows (auth navigation, path browsing, offline/pending-sync).

## 🙏 Credits

Maps, geocoding and directions use [Mapbox](https://www.mapbox.com/). Weather data uses [OpenWeatherMap](https://openweathermap.org/).

## 👥 Authors

Academic project for the **Software Engineering 2** course at Politecnico di Milano (A.Y. 2025/2026).

<p align="center">
  <img src="RASD/Images/PolimiLogo.png" alt="Politecnico di Milano" width="220">
</p>

| Author | Contact |
|--------|---------|
| José Martínez Estévez | [jose3.martinez@mail.polimi.it](mailto:jose3.martinez@mail.polimi.it) |
| Pablo Jesús Herrero Díaz | [pablojesus.herrero@mail.polimi.it](mailto:pablojesus.herrero@mail.polimi.it) |

## 📄 License

MIT — see [LICENSE](LICENSE).
