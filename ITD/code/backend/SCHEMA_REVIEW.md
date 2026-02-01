# Análisis del schema.sql: Problemas de normalización y redundancia

## Problemas identificados

### 1. **Inconsistencia en claves foráneas: UUIDs vs natural keys**

**Tablas `paths` y `saved_paths` usan claves naturales (username, path_name) en FK:**

- `paths.posted_by_username` → `users.username` (VARCHAR)
- `saved_paths.username` → `users.username` (VARCHAR)
- `saved_paths.path_name` → `paths.path_name` (VARCHAR)

**Problemas:**
- **Riesgo de inconsistencia** si se permite cambiar `users.username` (ON UPDATE no está definido; por defecto es `NO ACTION` y fallaría).
- **Riesgo de inconsistencia** si se permite cambiar `paths.path_name` (mismo problema).
- **Rendimiento**: JOIN por VARCHAR es menos eficiente que por UUID (índice en PK UUID suele ser más rápido).
- **Mezcla de diseño**: `ratings` y `trips` usan UUIDs (`user_id` → `users.id`, `path_id` → `paths.id`), pero `paths` y `saved_paths` usan natural keys. Esto dificulta queries complejas y genera inconsistencia en la capa de aplicación.

**Repositorios afectados:**
- `pathRepository.js` (línea 20): `path.postedByUsername` al insertar.
- `savedPathRepository.js`: usa `username` y `path_name` en INSERT/DELETE/SELECT.

### 2. **Campo `user_rating` en paths es redundante**

- `paths.user_rating`: calculado a partir de `ratings.points` (media).
- Se actualiza con `updatePathRating()` cada vez que se crea/borra un rating.

**Problema:**
- **Redundancia**: la media ya se puede calcular con `SELECT AVG(points) FROM ratings WHERE path_id = ...`.
- **Riesgo de desincronización**: si falla un UPDATE tras crear/borrar un rating, `user_rating` queda desactualizado.

**Alternativa:**
- Eliminar `user_rating` de `paths` y calcular la media en queries (o usar una vista materializada si hay problemas de rendimiento con millones de ratings).
- Si se mantiene por rendimiento, añadir un trigger en `ratings` para actualizar `user_rating` automáticamente (o documentar que es un caché y puede desincronizarse).

### 3. **Columnas de weather duplicadas en `paths` y `trips`**

**`paths` tiene:**
- `temperature`, `wind_speed`, `wind_degree`, `wind_gust`, `visibility`, `rain`, `clouds`

**`trips` tiene:**
- `temperature`, `wind_speed`, `wind_degree`, `wind_gust`, `visibility`, `rain`, `clouds`

**Contexto:**
- `paths.weather`: tiempo en el origen cuando se **crea** el path (snapshot estático).
- `trips.weather`: tiempo cuando el usuario **hace** un trip (puede ser en otra fecha/hora, distinto al del path).

**Conclusión:** No es redundancia real; son datos independientes (tiempo al crear path vs tiempo al hacer trip). Está bien tenerlos en ambas tablas.

### 4. **`saved_paths` usa `path_name` en lugar de `path_id`**

- PK compuesta: `(username, path_name)`.
- FK: `path_name` → `paths(path_name)`.

**Problemas:**
- Si se cambia `paths.path_name` (ej. usuario renombra su ruta), falla o hay que hacer ON UPDATE CASCADE (no está definido; por defecto `NO ACTION`).
- JOIN por VARCHAR menos eficiente que por UUID.
- **Ejemplo de problema:** si usuario guarda una ruta con nombre "Mi ruta" y luego el dueño la renombra a "Mi ruta editada", el vínculo en `saved_paths` apuntaría a un `path_name` que ya no existe → error 23503 al intentar insertar o el CASCADE borra la entrada de favoritos sin que el usuario lo sepa.

**Solución:**
- Usar `(username, path_id)` como PK y FK a `paths(id)` (UUID).

---

## Recomendaciones de normalización

### Opción A: Normalizar completamente (recomendada)

1. **Usar UUIDs para todas las FK:**
   - `paths.posted_by_username` → `paths.posted_by_user_id UUID` FK a `users.id`.
   - `saved_paths.username` → `saved_paths.user_id UUID` FK a `users.id`.
   - `saved_paths.path_name` → `saved_paths.path_id UUID` FK a `paths.id`.
   - PK de `saved_paths`: `(user_id, path_id)`.

2. **Eliminar o documentar `user_rating`:**
   - Calcular la media en queries cuando se necesite (simple y siempre sincronizado).
   - O añadir trigger en `ratings` para actualizar `user_rating` automáticamente.
   - O documentar que es un caché y puede desincronizarse (y añadir índice en `ratings(path_id)` para que la consulta de media sea rápida).

3. **Añadir ON UPDATE CASCADE (si se mantienen natural keys):**
   - Si se decide mantener `username` y `path_name` en FK, añadir `ON UPDATE CASCADE` para que renombrar un username o path_name propague el cambio.
   - Ejemplo: `FOREIGN KEY (posted_by_username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE`.

### Opción B: Mantener el diseño actual pero documentar restricciones

- Documentar en código (y en README) que **no se permite** cambiar `users.username` ni `paths.path_name` una vez creados (o se rompería la integridad referencial).
- Esto evita el problema de propagación de cambios, pero limita la flexibilidad del sistema.
- Añadir validación en el backend para rechazar cambios de username o path_name.

---

## Datos que introducen los usuarios y su almacenamiento

### Registro de usuario (RegisterScreen)

**Datos enviados:**
- `email`, `password`, `name` (full_name)

**Tabla:** `users`

**Columnas usadas:**
- `id` (UUID generado)
- `username` (backend lo asigna = email; línea 20 authService.js: `const username = email;`)
- `password_hash` (bcrypt del password)
- `full_name` (del campo `name`)
- `email`

**Problema:** `users.username` = `users.email` siempre (no se usa un username distinto). Esto hace que `username` sea redundante.

**Solución:**
- Eliminar `username` y usar solo `email` en todas las FK.
- O permitir que el usuario elija un `username` diferente al email (más común en redes sociales).

### Creación de path (PathCreateManualScreen)

**Datos enviados:**
- `name`, `description`, `startPoint`, `endPoint`, `distance`, `difficulty`, `startX/Y`, `endX/Y`, `routeData`, `publish`, `durationMinutes`, weather (si se añade).

**Tabla:** `paths`

**Columnas usadas:**
- `id` (UUID generado)
- `path_name` (de `name`)
- `start_x`, `start_y`, `end_x`, `end_y`
- `length` (de `distance`)
- `description`, `difficulty` (recién añadidos)
- `route_data` (JSONB de `routeData`)
- `is_published` (de `publish`)
- `origin_place`, `destination_place` (de `startPoint`, `endPoint`)
- `duration_minutes`
- weather (temperature, etc.)
- `posted_by_username` (backend lo añade del token; `req.user.username`)
- `user_rating` = 0 (inicial)
- `status` = 'optimal' (por defecto)

**Todo se guarda correctamente** tras los cambios recientes (description, difficulty).

### Creación de review (PathDetailScreen formulario)

**Datos enviados:**
- `pathId`, `points` (1–5), `opinion` (comentario opcional)

**Tabla:** `ratings`

**Columnas usadas:**
- `id` (UUID generado)
- `user_id` (backend lo añade del token; `req.user.id`)
- `path_id`
- `points`
- `opinion`
- `reported_status` (backend lo asigna = 'optimal' por defecto)

**Todo se guarda correctamente.**

### Guardar path en favoritos (saved_paths)

**Acción:** usuario pulsa "guardar" en un path.

**Tabla:** `saved_paths`

**Columnas usadas:**
- `username` (del token)
- `path_name` (se busca el path por id y se usa `path.path_name`)

**Problema:** si el dueño renombra el path, el vínculo se rompe (ver problema 4 arriba).

---

## Resumen de cambios sugeridos

| Problema | Solución | Prioridad |
|----------|---------|-----------|
| FK por natural keys (username, path_name) | Cambiar a UUIDs (user_id, path_id) en paths y saved_paths | Alta |
| `user_rating` redundante | Eliminar o añadir trigger para sincronizar | Media |
| `username` = `email` siempre | Eliminar username o permitir username distinto al email | Media |
| Falta ON UPDATE CASCADE en FK naturales | Añadir ON UPDATE CASCADE o validar que no se permitan cambios | Alta (si se mantienen natural keys) |
| saved_paths usa path_name en lugar de path_id | Cambiar PK a (user_id, path_id) y FK a paths(id) | Alta |

---

## Migración propuesta (si se aplica normalización completa)

1. Añadir columnas: `paths.posted_by_user_id UUID`, `saved_paths.user_id UUID`, `saved_paths.path_id UUID`.
2. Popular con datos existentes: UPDATE paths SET posted_by_user_id = (SELECT id FROM users WHERE username = posted_by_username).
3. Añadir FK: ALTER TABLE paths ADD CONSTRAINT fk_path_user_id FOREIGN KEY (posted_by_user_id) REFERENCES users(id).
4. Eliminar FK antiguas y columnas: ALTER TABLE paths DROP CONSTRAINT fk_path_user; ALTER TABLE paths DROP COLUMN posted_by_username.
5. Actualizar repositorios para usar UUIDs en lugar de username/path_name.

---

**Documento generado para revisión del usuario.**
