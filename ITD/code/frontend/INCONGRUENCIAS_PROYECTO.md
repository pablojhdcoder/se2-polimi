# Informe de incongruencias del proyecto (frontend)

Revisión realizada sobre el código del frontend (React Native / Expo) para detectar inconsistencias, bugs y discrepancias de diseño.

---

## 1. Corregidos en la primera revisión

### 1.1 Bug: `obstacleEventsRef` no definido en RecordTripScreen
- **Ubicación:** `src/pages/RecordTripScreen/RecordTripScreen.js`
- **Corrección:** Se añadió `obstacleEventsRef = useRef([])` y un `useEffect` que mantiene el ref sincronizado con el estado `obstacleEvents`.

### 1.2 Duplicado en `STRINGS`: `END_TRIP_NOW`
- **Ubicación:** `src/constants/strings.js`
- **Corrección:** Se eliminó la entrada duplicada de `END_TRIP_NOW`.

---

## 2. Incongruencias de diseño (corregidas en segunda revisión)

### 2.1 Dos pantallas de “grabar viaje”: TripRecordingScreen vs RecordTripScreen
- **Corrección:** En `MainStack.js` y `MainTabs.js` se usa ahora **RecordTripScreen** para las rutas `TripRecording` y `RecordTrip`. La app muestra la pantalla completa (trip + obstacle detection) y pasa obstáculos reales a ReviewDetectedPath. TripRecordingScreen sigue existiendo y exportándose (p. ej. para tests) pero ya no se monta en la navegación principal.

### 2.2 TripDetectionEngine: callbacks asignables vs métodos
- **Ubicación:** `src/sensors/trip-detection/TripDetectionEngine.js`
- **Corrección:** Se unificó el modelo a **solo callbacks registrables**:
  - Añadidos `onStateChange(cb)`, `removeOnStateChange(cb)`, `removeOnTripStart(cb)`, `removeOnTripEnd(cb)`.
  - Eliminadas las propiedades asignables `onStateChange`, `onTripStart`, `onTripEnd`.
  - Se llama a los callbacks de cambio de estado en cada transición de estado (RECORDING, TRIP_STARTED, TRIP_ENDED, IDLE).
  - RecordTripScreen y TripRecordingScreen usan ahora solo los métodos add/remove con cleanup en el `useEffect`.

### 2.3 TripRecordingScreen: listener `onTripEnd` sin limpieza
- **Ubicación:** `src/pages/TripRecordingScreen/TripRecordingScreen.js`
- **Corrección:** En el cleanup del `useEffect` se llama a `TripDetectionEngine.removeOnTripEnd(onEnd)` para evitar acumulación de callbacks al montar/desmontar la pantalla.

---

## 3. Mejoras aplicadas (navegación y consistencia)

### 3.1 Navegación desde TripStatisticsScreen al “Record trip”
- **Ubicación:** `src/pages/TripStatisticsScreen/TripStatisticsScreen.js`, función `goToRecordTrip`.
- **Corrección:** Cuando la pantalla está dentro del Tab Navigator (`parent` existe), se usa navegación anidada explícita: `navigation.navigate('StartTrip', { screen: 'TripRecording' })`. Si no hay parent, se mantiene `navigation.navigate('TripRecording')`.

### 3.2 Import de storage: `storageService` vs `storage`
- **Corrección:** TripStatisticsScreen y ProfileScreen importan ahora `getOfflineData` desde `'../../storage'` en lugar de `'../../storage/storageService'`, respetando el módulo unificado de persistencia.

---

## 4. Resumen

| Tipo                  | Cantidad | Estado                                      |
|-----------------------|----------|---------------------------------------------|
| Bugs (1ª revisión)    | 2        | Corregidos: obstacleEventsRef, END_TRIP_NOW |
| Diseño/contrato       | 3        | Corregidos: RecordTripScreen en rutas, engine callbacks unificados, cleanup onTripEnd |
| Mejoras opcionales    | 2        | Aplicadas: navegación tabs, imports storage |

Todas las incongruencias listadas en este informe han sido corregidas.
