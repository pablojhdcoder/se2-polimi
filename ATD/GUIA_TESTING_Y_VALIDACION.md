# Guía de testing y validación – ATD Best Bike Paths (Errigo-Gholami-Ianosel)

Esta guía explica **cómo probar la aplicación** y **cómo realizar la validación** que debe reflejarse en el ATD (Acceptance Test Document). Se apoya en:
- Un **ATD de referencia** (JhaBhatiaSharma): organización del documento y clases de pruebas.
- El **proyecto bajo validación**: Errigo-Gholami-Ianosel (Best Bike Paths).
- Tu **HOW_TO_TEST_MANUALLY.md** y la organización del ATD del equipo Errigo-Gholami-Ianosel.

---

## 1. ¿Tests en código: crearlos tú o usar los del equipo?

**En breve:**  
Hay que **ejecutar los tests que ya aporta el equipo** (backend y app). Lo que corresponde hacer para el ATD es:

1. **Lanzar** esos tests (no hace falta escribir tests nuevos en código a menos que el enunciado lo exija).
2. **Registrar** en el ATD los resultados (cuántos pasan/fallan y qué falla).
3. **Ejecutar pruebas manuales de aceptación** por funcionalidad (Signup/Login, Path Creation, Reporting Obstacles, Path Searching, etc.) y completar en el ATD: pasos, resultado esperado, resultado real y casos límite.

El ATD es un **documento de aceptación**: se refleja **qué** se ha probado, **de qué forma** y **qué resultado** se obtuvo. Los tests automatizados que se ejecutan son los del equipo Errigo-Gholami-Ianosel; no es necesario crear una suite nueva en código salvo que la asignación lo pida.

**Resumen:**

| Tipo de prueba | Responsable | Tu tarea |
|----------------|-------------|----------|
| Tests automatizados (Jest, backend y app) | Incluidos en el repo Errigo-Gholami-Ianosel | Ejecutarlos y dejar constancia en el ATD |
| Pruebas manuales de aceptación (registro, rutas, reportes, etc.) | Tú | Ejecutar los pasos, comparar esperado vs real y rellenar el capítulo de Testing del ATD |
| Instalación y entorno | Tú | Seguir ITD/README y dejar constancia en el capítulo de Installation del ATD |

---

## 2. Organización del ATD (referencia JhaBhatiaSharma y Errigo-Gholami-Ianosel)

En el ATD de referencia (JhaBhatiaSharma) se distinguen:

- **Cap. 1 – Introduction:** propósito, alcance, documentos de referencia (RASD, DD, ITD), organización del documento.
- **Cap. 2 – Installation / Implemented Requirements:**
  - Cómo se instaló (backend, frontend, dependencias, BD).
  - Entorno usado para las pruebas (Postman, registro, login, etc.).
  - Incidencias e incoherencias con la documentación.
- **Cap. 3 – Acceptance Test Cases (Testing):** casos llevados a cabo, vínculo con requisitos (RASD/DD/ITD), resultados obtenidos, fallos y mejoras sugeridas.

En el ATD de Errigo-Gholami-Ianosel el capítulo **Testing** se organiza por funcionalidad con:

- **Steps** (secuencia de pasos realizados).
- **Expected Result** (comportamiento esperado).
- **Actual Result** (comportamiento observado).
- **Edge Cases** (casos límite: email duplicado, contraseña incorrecta, etc.).

Esas secciones deben completarse para: Signup and Login, Path Creation, Reporting Obstacles, Path Searching, Other Functionalities.

---

## 3. Cómo probar la app y el backend – Plan de validación

### 3.1 Instalación (capítulo Installation del ATD)

Utiliza tu **HOW_TO_TEST_MANUALLY.md** (o los README de BACKEND y APP):

1. **Backend** (`Errigo-Gholami-Ianosel\IT\CODE\BACKEND`):
   - PostgreSQL (local o Prisma Accelerate), Redis, `.env` (JWT, DATABASE_URL, etc.).
   - `npm install`, `npx prisma migrate deploy`, `npx prisma generate`, `npm run dev`.
   - Verificar: `curl -i http://localhost:3000/health` → 200.

2. **App** (`Errigo-Gholami-Ianosel\IT\CODE\APP\src`):
   - `.env` en `IT/CODE/APP/src` con al menos una URL de API (`EXPO_PUBLIC_DEVEL_API_URL` o `EXPO_PUBLIC_PROD_API_URL`).
   - `npm install`, `npx expo start`.
   - Probar en emulador, dispositivo o web.

En el ATD hay que dejar constancia de: secuencia de pasos, incidencias (p. ej. JWT vacíos, Redis no documentado en local) y observaciones.

### 3.2 Tests automatizados (los del equipo)

**Backend** (`IT/CODE/BACKEND`):

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\BACKEND
npm install
# Opcional: DATABASE_URL para tests que usen DB (muchos usan mocks)
$env:DATABASE_URL = "postgresql://user:pass@localhost:5432/bbp"   # si hace falta
npx prisma generate --schema=prisma/schema.prisma
$env:NODE_OPTIONS = "--localstorage-file=./jest-storage"
npm test
```

- Registrar: total de tests, cuántos pasan, cuántos fallan o se omiten.
- Los tests que usan servicios externos (geocoding, weather, OSRM) pueden estar deshabilitados por defecto. Con `RUN_LIVE_TESTS=1 npm test` se ejecutan los “live”; si no se ejecutan, indicarlo en el ATD.

**App** (`IT/CODE/APP/src`):

```powershell
cd Errigo-Gholami-Ianosel\IT\CODE\APP\src
npm install
npm run test
```

- Registrar: si en Windows hace falta WSL, si algún suite falla, y el resumen (passed/failed/skipped).

Incluir en el ATD una tabla o párrafo resumen: “Backend: X tests passed, Y failed. App: …”.

### 3.3 Pruebas manuales de aceptación (capítulo Testing del ATD)

Por cada funcionalidad (Signup/Login, Path Creation, Reporting Obstacles, Path Searching, Otras):

1. **Steps:** secuencia concreta (p. ej. “Abrir app → Sign up → email X, password Y → Confirmar”).
2. **Expected Result:** comportamiento esperado según RASD/DD/ITD.
3. **Actual Result:** qué se observó (pantallas, mensajes, errores).
4. **Edge Cases:** email duplicado, contraseña incorrecta, sin red, etc., y resultado.

Funcionalidades a cubrir (según `Errigo-Gholami-Ianosel\ATD\Files\testing.tex`):

- Signup and Login  
- Path Creation (manual y/o automático si aplica)  
- Reporting Obstacles  
- Path Searching  
- Other Functionalities (perfil, viajes, estadísticas, configuración, etc.)

El RASD/DD/ITD del proyecto sirve para alinear los “Expected Result” con los requisitos.

### 3.4 Incidencias y mejoras ya detectadas (tu HOW_TO_TEST_MANUALLY.md)

Incluir en el ATD (p. ej. “Issues and Documentation Gaps” o “Areas for Improvement”):

- **Maximum update depth exceeded** en Create path (emulador): documentar y sugerir estabilizar estado / throttle en `handlePanDrag`.
- **Snapping 500:** fallo al snap de segmentos; documentar y sugerir manejo de error y feedback al usuario.
- **Documentación:** JWT obligatorios no explicados, Redis para ejecución local no documentado, orden de operaciones (DB antes de migraciones).

---

## 4. Checklist de validación

- [ ] Instalación backend documentada (pasos, problemas).
- [ ] Instalación app documentada (pasos, `.env`, problemas).
- [ ] Tests backend ejecutados; resultados (passed/failed/skipped) en el ATD.
- [ ] Tests app ejecutados; resultados en el ATD.
- [ ] Pruebas manuales por funcionalidad (Steps, Expected, Actual, Edge cases).
- [ ] Problemas encontrados y mejoras sugeridas reflejados en el ATD.
- [ ] Referencias a RASD, DD e ITD del proyecto Errigo-Gholami-Ianosel.

---

## 5. Resumen ejecutivo

| Qué | Dónde | Qué reflejar en el ATD |
|-----|--------|------------------------|
| Tests backend | `IT/CODE/BACKEND` → `npm test` | Nº de tests passed/failed/skipped; fallos relevantes. |
| Tests app | `IT/CODE/APP/src` → `npm run test` | Si se ejecutaron; conteos y fallos. |
| Servidor backend | `IT/CODE/BACKEND` → `npm run dev` | Si arranca; health check; BD usada. |
| App (Expo) | `IT/CODE/APP/src` → `npx expo start` | Si arranca; dispositivo/emulador; conexión con la API. |
| Casos manuales | App + Backend | Por requisito/funcionalidad: Expected vs Actual, Pass/Fail, edge cases. |

**¿Tests en código?** Ejecutar los que aporta el equipo y dejar constancia de los resultados en el ATD es suficiente. Solo haría falta escribir tests nuevos si el enunciado de la asignación lo exige de forma explícita.

Si tienes el enunciado en PDF o texto (p. ej. “Assignment IT 2025-2026”) y los requisitos concretos de entrega, se puede alinear esta guía con ese enunciado.
