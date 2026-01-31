# Implementation Plan: Backend & Infrastructure Integration (José's Part)

This plan outlines the steps to integrate the remaining backend and infrastructure components for the Best Bike Paths (BBP) prototype.

## 1. API Extensions (Fase 5 - Gateway & Controllers)
- **Goal**: Expose the new route storage capabilities to the frontend.
- **Actions**:
    - Update `tripController.js` to include `updateTripRoute`.
    - Update `tripRoutes.js` to expose `PATCH /api/trips/:id/route`.
    - Verify `pathController.js` handles `route_data` correctly in the `createPath` flow.

## 2. External Services Integration (Fase 5)
- **Goal**: Connect the system to real-world data and notifications.
- **Actions**:
    - Create `src/services/external/weatherService.js`:
        - Implement wrapper for OpenWeatherMap API.
        - Integration point: Call from `automaticTripStart` to populate weather fields.
    - Create `src/services/external/emailService.js`:
        - Implement basic wrapper for email notifications (e.g., using NodeMailer or a Mock for prototype).

## 3. Infrastructure & Real-time Tracking (Fase 4 & 5)
- **Goal**: Optimize trip recording and background processing.
- **Actions**:
    - **Redis Integration**:
        - Implement a Redis-based cache for live trip coordinates in `trip_record` / `updateTripTrack`.
        - Reduces write load on PostgreSQL during active tracking.
    - **RabbitMQ Integration**:
        - Implement a basic producer/consumer pattern for asynchronous tasks.
        - Task: Recalculating path ratings/stats after a trip finishes (offloading `updatePathStats` from the main request loop).

## 4. Sequence Diagrams & Documentation (Fase 9)
- **Goal**: Document the integrated flows.
- **Actions**:
    - Generate sequence diagrams for:
        - "Store Planned Path" (Frontend -> Gateway -> PathService -> Postgres).
        - "Live Trip Tracking" (Frontend -> Gateway -> TripService -> Redis -> Postgres).
        - "Weather Data Accrual" (TripStart -> WeatherService -> External API).

---

## Artifacts to be Created:
1. `src/services/external/weatherService.js`
2. `src/services/external/emailService.js`
3. Updated `tripController.js` and `tripRoutes.js`
4. Redis/RabbitMQ initialization scripts.
