# How to Test Errigo-Gholami-Ianosel (Best Bike Paths) Manually

This guide follows the official **IT/CODE/APP/README.md** and backend README so you can run the app and tests without issues. Use the paths relative to your project root (where the repo is cloned).

---

## Important: App project root

The app’s **project root** is **`IT/CODE/APP/src`**. All app commands and the `.env` file must be run/placed there (not in `IT/CODE/APP`).

---

# Part A: Running the mobile app (Expo)

## A.1 Prerequisites (from README)

- **Node.js** (LTS recommended)
- **npm** (comes with Node.js)
- **Expo Go** (on your phone) if you want to run on a physical device
- (Optional) Android emulator or iOS simulator

## A.2 Create the `.env` file

1. Go to the **app project root**:  
   `Errigo-Gholami-Ianosel\IT\CODE\APP\src`

2. Create a file named **`.env`** in that folder (same level as `package.json` and `app.config.js`).

3. Put at least **one API URL** (README: *“At least one of the two API URLs must be provided”*). For local backend use development:

```env
# Backend URL – REQUIRED (at least one of the two below)
EXPO_PUBLIC_PROD_API_URL=
EXPO_PUBLIC_DEVEL_API_URL=http://localhost:3000/api/v1

# Google Maps – required for map rendering; blank = maps may not work
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=

# Optional
EXPO_PUBLIC_SUPPORT_EMAILS=
```

**Which URL to use:**

- **Backend on same PC, app in browser/emulator on same PC:**  
  `EXPO_PUBLIC_DEVEL_API_URL=http://localhost:3000/api/v1`
- **Backend on same PC, app on physical phone (Expo Go):**  
  Use your PC’s LAN IP, e.g. `EXPO_PUBLIC_DEVEL_API_URL=http://192.168.1.XXX:3000/api/v1`  
  (Same Wi‑Fi for phone and PC; backend must listen on `0.0.0.0`; firewall must allow port 3000.)
- **Backend on same PC, app on Android emulator:**  
  `EXPO_PUBLIC_DEVEL_API_URL=http://10.0.2.2:3000/api/v1`

If you change `.env` later, restart Expo and clear cache: `npx expo start -c`.

## A.3 First-time setup and run (from README)

All commands from **`IT/CODE/APP/src`**:

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\APP\src

# 1. Install dependencies
npm install

# 2. Start the development server
npx expo start
```

Then in the Expo CLI:

- Press **`a`** → run on Android (emulator)
- Press **`i`** → run on iOS (macOS only)
- Or **scan the QR code** with **Expo Go** on your phone

## A.4 Troubleshooting (from README)

| Problem | Solution |
|--------|----------|
| API calls fail with `localhost:3000` on phone | On a physical device, `localhost` is the phone. Set `EXPO_PUBLIC_DEVEL_API_URL` to your PC’s LAN IP (e.g. `http://192.168.1.XXX:3000/api/v1`). Same Wi‑Fi; backend on `0.0.0.0`; firewall allows 3000. |
| Android emulator | Use `EXPO_PUBLIC_DEVEL_API_URL=http://10.0.2.2:3000/api/v1`. |
| Expo Go on iPhone can’t reach Metro | Some networks block LAN. Run: `npx expo start --tunnel` (slower but works). |
| Changes in `.env` not applied | Variables are injected at build time. Restart and clear cache: `npx expo start -c`. |

### "Signup failed" – configuration checklist

Signup calls `POST /api/v1/users/register`. If you see "Signup failed", the app is not reaching the backend or the backend is rejecting the request. **Fix only .env (no code changes).**

1. **Where are you running the app?**
   - **Browser (Expo web) or same PC:** In **`IT/CODE/APP/src/.env`** use `EXPO_PUBLIC_DEVEL_API_URL=http://localhost:3000/api/v1`. Leave `EXPO_PUBLIC_PROD_API_URL=` empty.
   - **Expo Go on a physical phone:** `localhost` on the phone is the phone itself. Set `EXPO_PUBLIC_DEVEL_API_URL=http://YOUR_PC_IP:3000/api/v1` (e.g. `http://192.168.1.100:3000/api/v1`). Find your PC IP with `ipconfig`. Same Wi‑Fi; backend running; firewall allows 3000.
   - **Android emulator:** `EXPO_PUBLIC_DEVEL_API_URL=http://10.0.2.2:3000/api/v1`

2. **After changing `.env`:** restart Expo and clear cache: `npx expo start -c`

3. **Backend must be running** on port 3000. From the same PC: `curl -s -o Nul -w "%{http_code}" http://localhost:3000/health` should return 200.

## A.5 Optional: Google Maps keys

For full map behaviour (README: *“Missing or invalid keys may result in blank maps or runtime errors”*):

1. Create a project in **Google Cloud Console**.
2. Enable **Maps SDK for Android** and **Maps SDK for iOS**.
3. Create API keys and set in `.env`:
   - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=...`
   - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=...`
4. Restart with cache clear: `npx expo start -c`.

---

# Part B: Running the backend (so the app can call the API)

The app needs the backend running and reachable at the URL you put in `EXPO_PUBLIC_DEVEL_API_URL` (or `EXPO_PUBLIC_PROD_API_URL`).

**Location:** `Errigo-Gholami-Ianosel\IT\CODE\BACKEND`


---

## B.0 Database setup (Prisma) – required before first run

The backend uses **PostgreSQL** and **Prisma**. You must have a database and apply migrations before `npm run dev` will work.

### Option 1: Local PostgreSQL (recommended for testing)

**Step 1 – Have PostgreSQL and a database**

- **If PostgreSQL is installed** (e.g. from https://www.postgresql.org/download/windows/):  
  Create a database named `bbp` (e.g. with pgAdmin: right‑click Databases → Create → Database → name `bbp`, or with `psql -U postgres -c "CREATE DATABASE bbp;"`).
- **If you use Docker:**  
  ```powershell
  docker run -d --name bbp-postgres -e POSTGRES_USER=bbp -e POSTGRES_PASSWORD=bbp -e POSTGRES_DB=bbp -p 5432:5432 postgres:16-alpine
  ```  
  Then user = `bbp`, password = `bbp`, database = `bbp`.

**Step 2 – Backend `.env` with database URL**

In **`Errigo-Gholami-Ianosel\IT\CODE\BACKEND`** create a file **`.env`** (same folder as `package.json`) with at least:

```env
PORT=3000
DEBUG=false
JWT_SECRET=your-jwt-secret-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-at-least-32-characters
DATABASE_URL="postgresql://bbp:bbp@localhost:5432/bbp"
OSRM_BASE_URL=http://localhost:5000
OSRM_TIMEOUT_MS=8000
GEOCODING_TIMEOUT_MS=8000
OPENMETEO_TIMEOUT_MS=8000
REDIS_HOST=localhost
REDIS_PORT=6379
```

Use your real PostgreSQL user/password/database if different (e.g. `postgresql://postgres:postgres@localhost:5432/bbp`).

**Step 3 – Apply migrations and generate Prisma client**

From the backend folder:

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
npm install
npx prisma migrate deploy
npx prisma generate --schema=prisma/schema.prisma
```

- **`prisma migrate deploy`** applies all migrations in `prisma/migrations` and creates/updates tables.
- **`prisma generate`** generates the Prisma client; required after any schema change or first-time setup.

If Step 3 fails with “Can’t reach database”, check that PostgreSQL is running, the database exists, and `DATABASE_URL` in `.env` is correct.

### Option 2: Prisma Accelerate (cloud)

If the BBP team gave you a Prisma Accelerate URL:

1. In **`IT/CODE/BACKEND\.env`** set only:
   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=THE_KEY_THEY_GAVE_YOU"
   ```
   (plus the other variables: `JWT_SECRET`, `JWT_REFRESH_SECRET`, etc.).
2. Then run the same commands as in Step 3 above:
   ```powershell
   cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
   npx prisma migrate deploy
   npx prisma generate --schema=prisma/schema.prisma
   ```

---

## B.0.5 Redis setup (required to avoid connection errors)

The backend expects Redis for caching. If Redis is not running, it will log repeated connection errors.

**One-time setup with Docker:**

```powershell
docker run -d --name bbp-redis -p 6379:6379 redis:7-alpine
```

- **Port:** `6379` on the host (backend uses `REDIS_HOST=localhost`, `REDIS_PORT=6379` in `.env`).
- **Check:** `docker exec bbp-redis redis-cli ping` → should print `PONG`.
- **Start again after reboot:** `docker start bbp-redis`.

If you already had a container `bbp-redis` without port mapping, remove it and run the command above:  
`docker rm bbp-redis` then `docker run -d --name bbp-redis -p 6379:6379 redis:7-alpine`.

---

## B.1 Other prerequisites

- Node.js, npm (already used in B.0).
- Redis: see **B.0.5** above.

## B.2 Start the backend

After the database is set up (B.0) and `.env` is complete:

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
npm run dev
```

Check: `curl -i http://localhost:3000/health` → expect **200 OK**. Then the app can use `http://localhost:3000/api/v1` (or your LAN IP / 10.0.2.2 as in A.2).

---

# Part C: Running tests

## C.1 Backend tests

**Location:** `Errigo-Gholami-Ianosel\IT\CODE\BACKEND`

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
npm install
$env:DATABASE_URL = "postgresql://user:pass@localhost:5432/bbp"
npx prisma generate --schema=prisma/schema.prisma
$env:NODE_OPTIONS = "--localstorage-file=./jest-storage"
npx jest
```

No real database is needed for tests (mocked). Note how many tests pass/skip for the ATD.

## C.2 App tests (README: `npm run test`)

**Location:** `Errigo-Gholami-Ianosel\IT\CODE\APP\src`

From the **app project root** (`IT/CODE/APP/src`):

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\APP\src
npm install
npm run test
```

Targeting a specific suite (from README):

```powershell
npm run test -- tests/integration/auth
```

On Windows, if `npm run test` finds no tests, try from **WSL** in the same path, or run a single file:

```powershell
npx jest tests/unit/utils/geo.test.ts
```

Note the results for the ATD.

---

# Checklist before running the app

- [ ] `.env` is in **`IT/CODE/APP/src`** (not in `IT/CODE/APP`).
- [ ] In `.env`, at least one of `EXPO_PUBLIC_DEVEL_API_URL` or `EXPO_PUBLIC_PROD_API_URL` is set.
- [ ] If using a physical phone: URL uses your PC’s LAN IP; phone and PC on same Wi‑Fi; backend listens on `0.0.0.0`; port 3000 not blocked by firewall.
- [ ] If using Android emulator: URL is `http://10.0.2.2:3000/api/v1`.
- [ ] Backend is running and `http://localhost:3000/health` returns 200 (if app uses localhost or the same machine).
- [ ] All app commands are run from **`IT/CODE/APP/src`**.
- [ ] After any `.env` change: restart Expo with `npx expo start -c`.

---

# Summary for the ATD document

| What | Where to run | What to write in the ATD |
|------|----------------|---------------------------|
| Backend tests | `IT/CODE/BACKEND` | Number of tests/suites passed/skipped; any failure. |
| App tests | `IT/CODE/APP/src` | Whether they ran; counts and failures. |
| Backend server | `IT/CODE/BACKEND` | Whether it started; health check result; DB used. |
| App (Expo) | `IT/CODE/APP/src` | Whether Expo started; device/emulator; API connection. |
| Manual cases | — | For each requirement: Expected vs Actual, Pass/Fail. |

After you have these results, update the ATD chapters (especially 2 and 3) with the real outcomes.

---

# Errors encountered during manual testing

Document here any runtime or console errors seen while running the app or backend, so they can be reported in the ATD (e.g. Chapter 2 "Problems Encountered" or Chapter 3 "Areas for Improvement").

## Console error: Maximum update depth exceeded (Create Path – emulator)

| Field | Description |
|-------|-------------|
| **When** | While testing the "Create path" flow in the app, in **manual** draw mode (tapping or dragging on the map to draw the route). |
| **Where** | Mobile app, screen **Create path** (`IT/CODE/APP/src/app/(main)/create-path.tsx`). Observed in the **emulator** (React Native / Expo). |
| **Message** | `Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.` |
| **Call stack** | The error is triggered from `handlePanDrag` in `create-path.tsx`. The stack includes `dispatchSetState`, `handlePanDrag`, and references to `create-path.tsx` and React/React Native internals (e.g. `ReactFabric-dev.js`, `LogBox`). |
| **Cause (technical)** | In manual mode, drawing on the map uses `onPanDrag` on the `MapView`. Each drag event calls `setDrawnRoute`, which updates state. A `useEffect` in the same file depends on `drawnRoute` and runs logic that can trigger further state updates (e.g. snapping segments). Under rapid or repeated pan/drag events (typical in the emulator), this can lead to a cascade of updates and exceed React's maximum update depth. |
| **Impact** | The Create path screen may become unusable when drawing by dragging on the map in the emulator: the red "Console Error" appears and the app can freeze or behave erratically. |
| **Workaround** | Prefer **taps** on the map to add points instead of long drags, or test the "Create path" flow on a **physical device** where pan/drag behaviour may not trigger the loop. |
| **For the ATD** | Report as a problem encountered during testing; suggest as improvement to stabilise state updates in the Create path screen (e.g. throttle/debounce `handlePanDrag` or avoid triggering the snapping effect on every drag update). |

---

# What’s missing in the Errigo-Gholami-Ianosel documentation

When following only the official READMEs, the following are **not** explained. You can use this for the ATD (e.g. “Problems Encountered” / “Areas for Improvement”) and to run the system yourself.

| Missing item | Where it’s missing | What’s needed |
|--------------|--------------------|---------------|
| **JWT secrets** | Backend README, `.env` example | The example has `JWT_SECRET=` and `JWT_REFRESH_SECRET=` empty. The backend typically requires non-empty values to start. The README does not state that these must be set (e.g. length or format). |
| **Redis for local run** | Backend README | Redis is mentioned as optional; the example uses `REDIS_HOST=redis` (Docker service name). For running the backend on the host (not in Docker), there is no instruction to set `REDIS_HOST=localhost` or how to start Redis locally (e.g. Docker or install). |
| **Order of operations** | Backend README | It is not explicit that a working `DATABASE_URL` (and optionally Redis) must be configured **before** running `prisma migrate deploy` / `prisma generate`, and that `npm run dev` will fail without a valid database. |

The **app** README (`IT/CODE/APP/README.md`) is clear about project root (`IT/CODE/APP/src`), `.env` (API URL and Maps keys), and first-time run. The **backend** README documents database and Prisma setup; the table above lists any remaining gaps we noted (e.g. JWT, Redis for local run).
