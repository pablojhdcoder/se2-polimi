# How to Test Errigo-Gholami-Ianosel (Best Bike Paths) Manually

This guide explains how to run the backend tests, the app tests, and the backend/app for manual verification before finalising the ATD.

---

## 1. Backend tests (automated)

**Location:** `Errigo-Gholami-Ianosel/IT/CODE/BACKEND`

### Prerequisites
- Node.js and npm installed.
- `DATABASE_URL` must be set (even for tests), because `prisma generate` reads it from `prisma.config.ts`. A placeholder is enough for the test run.

### Steps (PowerShell)

```powershell
cd "ruta\al\proyecto\Errigo-Gholami-Ianosel\IT\CODE\BACKEND"

# 1. Install dependencies (if not already done)
npm install

# 2. Set env and generate Prisma client
$env:DATABASE_URL = "postgresql://user:pass@localhost:5432/bbp"
npx prisma generate --schema=prisma/schema.prisma

# 3. Run all tests (on Windows the npm script uses Unix NODE_OPTIONS; run Jest directly)
$env:NODE_OPTIONS = "--localstorage-file=./jest-storage"
npx jest
```

**What you get:** Unit and integration tests run (no real database needed; DB is mocked). You should see ~248 tests passed, 11 skipped. Note the exact numbers and any failures to update the ATD.

---

## 2. App tests (automated)

**Location:** `Errigo-Gholami-Ianosel/IT/CODE/APP/src`

On Windows, `npm test` often finds **no tests** because Jest’s `testMatch` pattern with `{unit,integration}` can match zero files. Two options:

### Option A: Run tests from WSL (Linux)

If you have WSL:

```bash
cd /mnt/c/ruta/al/proyecto/Errigo-Gholami-Ianosel/IT/CODE/APP/src
npm install
npm test
```

If this discovers and runs tests, note the results (passed/skipped/failed) for the ATD.

### Option B: Run specific test files in PowerShell

Run Jest with an explicit path so it doesn’t rely on `testMatch`:

```powershell
cd "ruta\al\proyecto\Errigo-Gholami-Ianosel\IT\CODE\APP\src"

npm install

# Run all tests under tests/unit (one pattern per run if needed)
npx jest "tests/unit" --testPathPattern="tests/unit"

# Or run a single file, e.g.:
npx jest tests/unit/utils/geo.test.ts
npx jest tests/unit/auth/storage.test.ts
npx jest tests/integration/auth/login.integration.test.tsx
```

If some paths work and others don’t, document which suites you ran and their outcome for the ATD.

---

## 3. Run the backend server (for manual API / app testing)

**Location:** `Errigo-Gholami-Ianosel/IT/CODE/BACKEND`

The backend uses **Prisma** and expects a real database. The README assumes **Prisma Accelerate** (cloud). So you need a valid `DATABASE_URL`:

- **If the BBP team gave you a Prisma Accelerate URL/key:** use it in `.env`.
- **If you have a local PostgreSQL:** you can try a direct URL, but the project may be tuned for Accelerate (e.g. connection string format, extensions). If it works, use it.

### Steps

1. **Create `.env`** in `IT/CODE/BACKEND` (same folder as `package.json`), for example:

```env
PORT=3000
DEBUG=false
JWT_SECRET=some-secret-min-32-chars-long-for-jwt
JWT_REFRESH_SECRET=another-secret-min-32-chars-for-refresh
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bbp"
# Or Prisma Accelerate: DATABASE_URL="prisma+postgres://..."
OSRM_BASE_URL=http://localhost:5000
OSRM_TIMEOUT_MS=8000
GEOCODING_TIMEOUT_MS=8000
OPENMETEO_TIMEOUT_MS=8000
REDIS_HOST=localhost
REDIS_PORT=6379
```

2. **Database:**  
   - With **Prisma Accelerate:** no local DB; ensure `DATABASE_URL` is the one they gave you.  
   - With **local PostgreSQL:** create a DB (e.g. `bbp`), then run migrations:

```powershell
cd "ruta\al\proyecto\Errigo-Gholami-Ianosel\IT\CODE\BACKEND"
npx prisma migrate deploy
npx prisma generate --schema=prisma/schema.prisma
```

3. **Redis (optional but recommended):**  
   Backend can use Redis. If you have Docker:

```powershell
docker run -d -p 6379:6379 redis:7-alpine
```

4. **Start the backend:**

```powershell
npm run dev
```

5. **Check health:**

```powershell
curl -i http://localhost:3000/health
```

If you get **200 OK**, the backend is up. You can then call the API manually (e.g. with Postman or curl) for signup, login, paths, trips, etc., and note what works for the ATD.

---

## 4. Run the app (Expo) for manual UI testing

**Location:** `Errigo-Gholami-Ianosel/IT/CODE/APP/src`

The app must know the backend URL. Use the **same machine** as the backend for simplicity (e.g. `localhost`).

### Steps

1. **Create `.env`** in `IT/CODE/APP/src` (where `package.json` of the app is), for example:

```env
# Backend on same PC
EXPO_PUBLIC_DEVEL_API_URL=http://localhost:3000/api/v1

# Optional: leave empty if you only test without maps first
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=
EXPO_PUBLIC_SUPPORT_EMAILS=
```

2. **If you use a physical phone with Expo Go:**  
   Use your PC’s LAN IP instead of `localhost` (e.g. `http://192.168.1.100:3000/api/v1`). Backend must listen on `0.0.0.0` and firewall must allow port 3000.

3. **Install and start:**

```powershell
cd "ruta\al\proyecto\Errigo-Gholami-Ianosel\IT\CODE\APP\src"
npm install
npx expo start
```

4. In the Expo CLI:
   - **`a`** → Android emulator (if configured).
   - **`i`** → iOS simulator (only on macOS).
   - **QR code** → open with **Expo Go** on your phone (phone and PC on same Wi‑Fi, and `EXPO_PUBLIC_DEVEL_API_URL` with your PC’s IP if using phone).

5. **Manual checks you can do for the ATD:**  
   Sign up (R1), log in (R2), view/update profile (R3, R4), log out (R5), search paths (R35–R36), create path (R25/R28), start/stop trip (R12–R13), view trips/stats (R16–R18), report obstacle (R26), etc. Note for each: Pass / Fail and a short “Actual outcome”.

---

## 5. Summary: what to note for the ATD

| What | Where | What to write in the ATD |
|------|--------|---------------------------|
| Backend tests | § Implemented Requirements, § Acceptance Test Cases | Number of suites/tests passed/skipped; any failure. |
| App tests | Same sections | Whether they ran (e.g. via WSL or single files); counts and failures. |
| Backend server | § Implemented Requirements, § Problems/Observations | Whether you could start it (with which DB/Accelerate), health check result. |
| App run | Same | Whether Expo started and app connected to API; device/emulator used. |
| Manual cases | § Acceptance Test Cases (tables) | For each requirement you tried: Expected vs Actual, Pass/Fail. |

After you have these results, update the ATD chapters (especially Chapter 2 and Chapter 3) with the real numbers and outcomes so the document reflects what you actually verified.
