# Resultados de la ejecución de tests – Errigo-Gholami-Ianosel (Best Bike Paths)

Fecha de ejecución: 7 de febrero de 2026.  
Entorno: Windows 10, Node.js/npm, PowerShell.

---

## 1. Backend (`IT/CODE/BACKEND`)

### Comandos ejecutados

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
$env:NODE_OPTIONS = "--localstorage-file=./jest-storage"
npm run prisma:generate
npx jest --no-cache
```

(En Windows, `npm test` usa sintaxis Unix para `NODE_OPTIONS`; se ejecutó `npx jest` con la variable de entorno fijada en PowerShell.)

### Resultado

| Métrica              | Valor |
|----------------------|--------|
| Test Suites passed   | 24     |
| Test Suites skipped  | 2      |
| Test Suites total    | 26     |
| Tests passed        | 248    |
| Tests skipped       | 11     |
| Tests total         | 259    |
| Tiempo               | ~40,6 s |

### Resumen

- **Todos los tests ejecutados pasaron.** No hubo fallos.
- 2 suites y 11 tests se omiten por defecto (p. ej. tests que dependen de servicios externos en vivo; pueden ejecutarse con `RUN_LIVE_TESTS=1`).
- Suites: unit (auth, path, trip, user, report, stat, geo, jwt, weather, snapping, geocoding, error handler, validator, utils, fetch, trip.weather) e integration (auth, user, path, trip, report, stat, redis, weather.service).

---

## 2. App (`IT/CODE/APP/src`)

### Cambio previo en el repositorio evaluado

En Windows, el patrón de Jest `testMatch: ["<rootDir>/tests/{unit,integration}/**/*.test.ts?(x)"]` no encontraba ningún archivo (0 matches). Se actualizó `jest.config.js` a dos patrones explícitos sin llaves:

```js
testMatch: [
  "<rootDir>/tests/unit/**/*.test.ts?(x)",
  "<rootDir>/tests/integration/**/*.test.ts?(x)",
],
```

Tras este cambio, Jest descubrió y ejecutó todos los tests de la app.

### Comandos ejecutados

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\APP\src
npm run test
```

### Resultado

| Métrica              | Valor |
|----------------------|--------|
| Test Suites passed   | 35     |
| Test Suites failed   | 1      |
| Test Suites total    | 36     |
| Tests passed        | 211    |
| Tests failed         | 1      |
| Tests total         | 212    |
| Tiempo               | ~46,8 s |

### Suite que falla

- **Archivo:** `tests/integration/paths/searchResultsSheet.integration.test.tsx`
- **Caso:** «selection highlight renders for selected result»
- **Causa:** Error de entorno en Windows, no de lógica de la aplicación:
  - `EPERM: operation not permitted` al leer un archivo de la caché de Jest en `%TEMP%\jest\...` (Jest transform cache).
  - El error se produce al transformar/cargar código de React Native (`ScrollView`, `PlatformColorValueTypesios`) durante el render del componente en el test.
- **Conclusión:** El fallo se atribuye al entorno (permisos/caché de Jest en Windows), no a un bug funcional del código de Best Bike Paths. En otros entornos (p. ej. Linux/macOS o con caché limpia/permisos correctos) el test podría pasar.

### Suites que pasaron (resumen)

- **Unit:** api (auth, paths, reports, stats, trip), auth (storage, tokenManager, authSession), validation (auth, path), utils (geo, pathMappers, reportOptions), hooks (useFollowUserLocation).
- **Integration:** auth (login, signup, editProfile, apiClientRefreshFailure), navigation (welcome, guestAccess, loggedinAccess, redirects), paths (home, homeSearch, homeTripFlow, createPath, createPathModal, paths; falla solo searchResultsSheet), profile, reports (reportIssueModal, reportConfirmation), route (routeCard, routeMap), settings, trip (trips).

---

## 3. Resumen global

| Componente | Suites passed | Suites failed | Suites skipped | Tests passed | Tests failed | Tests skipped | Tiempo aprox. |
|------------|----------------|---------------|-----------------|--------------|--------------|---------------|----------------|
| Backend    | 24             | 0             | 2               | 248          | 0            | 11            | ~41 s          |
| App        | 35             | 1             | 0               | 211          | 1            | 0             | ~47 s          |
| **Total**  | **59**         | **1**         | **2**           | **459**      | **1**        | **11**        | **~88 s**      |

El único fallo (app, searchResultsSheet) está asociado al entorno Windows (caché/permisos de Jest), no a la funcionalidad de la aplicación.

---

## 4. Análisis en profundidad del fallo searchResultsSheet

### 4.1 Qué log indica que hay un fallo

En la salida de `npm run test`, Jest marca el fallo así:

1. **Línea de suite fallida** (antes del detalle):
   ```
   FAIL tests/integration/paths/searchResultsSheet.integration.test.tsx (31.703 s)
   ```

2. **Nombre del caso que falla** (debajo de `FAIL`):
   ```
     ● search results sheet guest messaging › selection highlight renders for selected result
   ```

3. **Primer mensaje de error (React)** — lo que ve el test al hacer `render()`:
   ```
     There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.
   ```
   Y más abajo el **archivo y línea** donde Jest señala el fallo:
   ```
   > 61 |         const { getByText, queryByText } = render(
         |                                                  ^
   ```

4. **Causa raíz (Jest/Node)** — en la sección "Cause:":
   ```
     Cause:
     jest: failed to read cache file: C:/Users/pablo/AppData/Local/Temp/jest/jest-transform-cache-.../a7/PlatformColorValueTypesios_a724d7c872629aede89125aac2a3367a
     Failure message: EPERM: operation not permitted, open 'C:\Users\pablo\AppData\Local\Temp\jest\...\PlatformColorValueTypesios_...'
   ```

5. **Resumen final** (al terminar todos los tests):
   ```
   Test Suites: 1 failed, 35 passed, 36 total
   Tests:       1 failed, 211 passed, 212 total
   ```

**Interpretación:** Cualquier línea `FAIL tests/...` y el bloque `● ... › <test name>` indican qué suite y qué caso han fallado. El **motivo real** del fallo está en el **Cause:** (EPERM al leer la caché de Jest), no en un `expect(...).toBeTruthy()` fallido del test.

---

### 4.2 Qué hace el test que falla

El caso **"selection highlight renders for selected result"** comprueba que, cuando hay resultados de búsqueda y uno está seleccionado (`selectedResultId="p2"`), la UI muestra el highlight en ese resultado y no en otro.

- Renderiza `<SearchResultsSheet visible results={[...]} selectedResultId="p2" />`.
- Espera encontrar el texto `"selected-Beta"` (el resultado p2) y que no exista `"selected-Alpha"` (p1).

El test en sí es correcto; el fallo ocurre **antes** de que se evalúen los `expect`: durante el **render** del componente.

---

### 4.3 Cadena del fallo (paso a paso)

1. Jest ejecuta el test y llega a `render(<SearchResultsSheet ...>)`.
2. `SearchResultsSheet` usa un **ScrollView** de React Native para la lista de resultados.
3. Para renderizar ese ScrollView, el entorno de tests tiene que **cargar y transformar** módulos de React Native (incluido código que referencia `PlatformColorValueTypesios`).
4. Jest usa una **caché de transformación** en disco (en `%TEMP%\jest\...`) para no re-transformar los mismos archivos en cada run.
5. En tu ejecución, al leer ese archivo de caché, **Node.js devuelve EPERM (operation not permitted)**. Posibles causas en Windows: otro proceso (antivirus, índice de búsqueda, otro Jest) tocando la carpeta; permisos de la carpeta temp; o bloqueos de archivos.
6. Esa excepción se lanza **dentro** del código que carga ScrollView durante el render. React la captura y muestra el mensaje genérico: *"There was an error during concurrent rendering but React was able to recover..."*.
7. Como el error no se “recupera” de forma que el test pueda seguir, Jest registra el caso como **fallido**.

Por tanto: el fallo **no** es que el test espere `"selected-Beta"` y la app no lo muestre; es que **el render no llega a completarse** por un error de I/O (EPERM) en la caché de Jest al cargar código de React Native.

---

### 4.4 Por qué se considera fallo de entorno y no de la aplicación

| Indicio | Interpretación |
|--------|-----------------|
| El mensaje **Cause** menciona explícitamente **"failed to read cache file"** y **"EPERM: operation not permitted"** | El fallo es de **acceso al sistema de archivos** (caché de Jest), no de la lógica de la app. |
| La ruta es **`C:\Users\...\AppData\Local\Temp\jest\...`** | Es la caché de Jest/Node, no código del proyecto ni de Best Bike Paths. |
| El **mismo test** podría pasar en otra máquina, en WSL, o tras borrar la caché (`npx jest --clearCache`) o ejecutar Jest con permisos adecuados | Refuerza que es **dependiente del entorno** (Windows, permisos, procesos que bloquean la carpeta temp). |
| Otros tests que también usan componentes con ScrollView o React Native a veces pasan | La EPERM puede ser intermitente o afectar solo a ciertos archivos de caché cuando se accede en un orden concreto. |

En resumen: **el log que indica fallo** es la línea `FAIL ... searchResultsSheet.integration.test.tsx` y el bloque `● ... › selection highlight renders for selected result`; la **razón técnica** es el **Cause: jest: failed to read cache file ... EPERM**, que se interpreta como fallo de entorno (Windows/caché/permisos), no como bug en la aplicación.

---

## 5. Interpretación del párrafo del ATD (lenguaje sencillo)

El texto del ATD dice algo así:

> *35 test suites passed, 1 failed; 211 tests passed, 1 failed (run time ∼47 s). The single failure is in tests/integration/paths/searchResultsSheet.integration.test.tsx (case "selection highlight renders for selected result"). The failure is due to EPERM: operation not permitted when Jest reads its transform cache under %TEMP%\jest on Windows—i.e. an environment/permissions issue, not an application bug. We therefore consider the app test suite to have run successfully for acceptance purposes; the remaining failure should be rechecked on Linux/macOS or with a clean Jest cache.*

**Qué significa en pocas palabras:**

| Parte del texto | Significado |
|-----------------|-------------|
| **35 suites passed, 1 failed** | De 36 grupos de tests (suites), 35 se ejecutaron bien y **uno** falló. |
| **211 tests passed, 1 failed** | De 212 pruebas individuales, 211 pasaron y **una** falló (la que está dentro de la suite que falla). |
| **run time ∼47 s** | Toda la suite de la app tardó unos 47 segundos. |
| **The single failure is in ... searchResultsSheet.integration.test.tsx** | El único fallo está en ese archivo de test (hoja de resultados de búsqueda). |
| **case "selection highlight renders for selected result"** | El caso concreto que falla es el que comprueba que se muestra el highlight en el resultado seleccionado. |
| **EPERM: operation not permitted when Jest reads its transform cache under %TEMP%\jest on Windows** | En Windows, Jest no pudo **leer** un archivo de su **caché** (en la carpeta temporal); el sistema devolvió “operación no permitida” (permisos o archivo bloqueado). |
| **environment/permissions issue, not an application bug** | El fallo es del **entorno** (Windows, permisos, caché), no de un error en el código de Best Bike Paths. |
| **We therefore consider the app test suite to have run successfully for acceptance purposes** | Por eso, para el **ATD** se considera que la suite de tests de la app **sí se ejecutó correctamente** en términos de aceptación; el único fallo no invalida la aceptación. |
| **the remaining failure should be rechecked on Linux/macOS or with a clean Jest cache** | Ese único fallo conviene **volver a ejecutarlo** en otro sistema (Linux/macOS) o tras limpiar la caché de Jest (`npx jest --clearCache`) para confirmar que no es un bug de la app. |

---

## 6. Salida de error por consola (texto completo)

A continuación se reproduce la salida que Jest mostró por consola para el test fallido (tal como aparece al ejecutar `npm run test` en `IT/CODE/APP/src`):

```
FAIL tests/integration/paths/searchResultsSheet.integration.test.tsx (31.703 s)
  ● search results sheet guest messaging › selection highlight renders for selected result

    There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.

      59 |         ]
      60 |
    > 61 |         const { getByText, queryByText } = render(
         |                                                  ^
      62 |             <SearchResultsSheet
      63 |                 visible
      64 |                 results={results}
      65 |                 selectedResultId="p2"
      66 |             />
      67 |         )
      68 |
      69 |         expect(getByText("selected-Beta")).toBeTruthy()
      70 |         expect(queryByText("selected-Alpha")).toBeNull()
      71 |     })

      at throwException (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:5669:9)
      at throwAndUnwindWorkLoop (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:11048:11)
      at renderRootSync (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:10794:19)
      at performWorkOnRoot (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:2094:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:5669:34)
      at Object.<anonymous>.process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:859:10)
      at actImplementation (node_modules/@testing-library/react-native/src/act.ts:30:25)
      at renderWithAct (node_modules/@testing-library/react-native/src/render-act.ts:13:11)
      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:69:33)
      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:44:10)
      at Object.<anonymous> (tests/integration/paths/searchResultsSheet.integration.test.tsx:61:50)

    Cause:
    jest: failed to read cache file: C:/Users/pablo/AppData/Local/Temp/jest/jest-transform-cache-0a0feb887b0263ed4bf0492b5a14fb76-79ef2876fae7ca75eedb2aa53dc48338/a7/PlatformColorValueTypesios_a724d7c872629aede89125aac2a3367a
    Failure message: EPERM: operation not permitted, open 'C:\Users\pablo\AppData\Local\Temp\jest\jest-transform-cache-0a0feb887b0263ed4bf0492b5a14fb76-79ef2876fae7ca75eedb2aa53dc48338\a7\PlatformColorValueTypesios_a724d7c872629aede89125aac2a3367a'

      111 |         </View>
      112 |       ) : (
    > 113 |         <ScrollView
          |          ^
      114 |           style={[styles.list, { maxHeight }]}
      115 |           contentContainerStyle={styles.listContent}
      116 |           showsVerticalScrollIndicator={false}
      ...

      at readCacheFile (node_modules/@jest/transform/build/ScriptTransformer.js:941:21)
      at readCodeCacheFile (node_modules/@jest/transform/build/ScriptTransformer.js:885:19)
      at ScriptTransformer.transformSource (node_modules/@jest/transform/build/ScriptTransformer.js:528:39)
      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:674:40)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:726:19)
      at Object.require (node_modules/react-native/Libraries/Animated/nodes/AnimatedColor.js:21:1)
      at Object.require (node_modules/react-native/Libraries/Animated/animations/SpringAnimation.js:17:1)
      at Object.require (node_modules/react-native/Libraries/Animated/AnimatedImplementation.js:25:1)
      at Object.require (node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js:34:1)
      at requireActual (node_modules/react-native/jest/mockComponent.js:34:12)
      at Object.mockComponent (node_modules/react-native/jest/mocks/ScrollView.js:29:23)
      at requireActual (node_modules/react-native/jest/mock.js:32:44)
      at Object.require [as ScrollView] (node_modules/react-native/index.js:101:12)
      at ScrollView (components/paths/SearchResultsSheet.tsx:113:10)
```

Y al final de toda la ejecución, el resumen:

```
Summary of all failing tests
FAIL tests/integration/paths/searchResultsSheet.integration.test.tsx (31.703 s)
  ● search results sheet guest messaging › selection highlight renders for selected result
    ... (mismo error y Cause que arriba) ...

Test Suites: 1 failed, 35 passed, 36 total
Tests:       1 failed, 211 passed, 212 total
Snapshots:   0 total
Time:        46.756 s
Ran all test suites.
```

La línea que identifica el **motivo real** del fallo es la del **Cause:** con la ruta de la caché y el mensaje **EPERM: operation not permitted, open '...'**.
