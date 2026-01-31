# Integration Flow Sequence Diagrams

This document contains Mermaid sequence diagrams for the integrated backend and infrastructure flows of Best Bike Paths (BBP).

## 1. Store Planned Path
This flow describes how a user saves a path including its pre-computed route data.

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant Gateway as API Gateway
    participant PS as PathService
    participant DB as PostgreSQL
    
    App->>Gateway: POST /api/paths
    Gateway->>Gateway: Validate JWT
    Gateway->>PS: addPath(pathInfo)
    PS->>PS: Generate UUID
    PS->>DB: INSERT INTO paths (...)
    DB-->>PS: Created Path Record
    PS-->>Gateway: Path Object
    Gateway-->>App: 201 Created (Path)
```

## 2. Live Trip Tracking (Optimized with Redis)
This flow shows the high-frequency coordinate recording using Redis lists to offload PostgreSQL.

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant Gateway as API Gateway
    participant TS as TripService
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant RMQ as RabbitMQ
    participant Worker as Stats Consumer
    
    App->>Gateway: PATCH /api/trips/:id/route
    Gateway->>TS: updateTripTrack(id, routeData)
    
    TS->>Redis: rPush(trip:id:coords, coords)
    TS->>Redis: rPush(trip:id:potholes, triggers)
    
    Note over TS, Redis: High-frequency caching phase
    
    TS-->>Gateway: 200 Cached
    Gateway-->>App: OK
    
    alt isFinal indicator received
        TS->>Redis: lRange(trip:id:coords)
        Redis-->>TS: Full Trace
        TS->>DB: UPDATE trips SET recorded_route = ... (includes triggers)
        TS->>RMQ: publish(path_stats_update)
        TS->>Redis: del(trip:id:*)
        TS-->>Gateway: Final Trip Object
        
        App->>Gateway: POST /api/potholes/confirm
        Gateway->>TS: confirmPotholes(id, selectedIndices)
        TS->>DB: INSERT INTO potholes (confirmed ones)
        TS-->>App: Confirmation Result
        
        RMQ->>Worker: Consume(stats_update)
        Worker->>DB: UPDATE paths SET user_rating = ...
    end
```

## 3. Weather Data Accrual
Integration with external OpenWeatherMap API during trip start.

```mermaid
sequenceDiagram
    participant TS as TripService
    participant WS as WeatherService
    participant EXT as OpenWeatherMap API
    participant DB as PostgreSQL
    
    TS->>WS: getCurrentWeather(lat, lon)
    WS->>EXT: GET /weather?lat=...&lon=...
    EXT-->>WS: JSON Response
    WS-->>TS: Weather Object
    TS->>DB: INSERT INTO trips (with weather fields)
    DB-->>TS: Trip Record
```
