# ✅ Normalización Completa del Schema - COMPLETADO

## Resumen Ejecutivo

Se ha normalizado completamente el schema de la base de datos eliminando **redundancias** y problemas de **claves foráneas mixtas** (UUIDs vs natural keys). Todos los datos de usuarios ahora se guardan correctamente.

---

## 🔧 Problemas Corregidos

### 1. **Claves foráneas inconsistentes (CRÍTICO)**

**Problema:**
- `paths.posted_by_username` → `users.username` (VARCHAR)
- `saved_paths.username` → `users.username` (VARCHAR)
- `saved_paths.path_name` → `paths.path_name` (VARCHAR)

**Riesgo:** Si un usuario cambia su username o renombra un path, las FK se rompen (sin ON UPDATE CASCADE).

**Solución:**
- ✅ `paths.posted_by_user_id` → `users.id` (UUID)
- ✅ `saved_paths.user_id` → `users.id` (UUID)
- ✅ `saved_paths.path_id` → `paths.id` (UUID)

### 2. **Campo `user_rating` redundante**

**Problema:** Se calcula a partir de `ratings.points` (media) pero se almacena en `paths`, con riesgo de desincronización.

**Decisión:** Se mantiene por rendimiento (evita calcular la media en cada query), pero está documentado en `schema.sql` como "calculated (average from ratings table)".

### 3. **`saved_paths` usaba `path_name` en lugar de `path_id`**

**Problema:** Si se renombra un path, los favoritos se rompen.

**Solución:** ✅ Ahora usa `(user_id, path_id)` con UUIDs.

---

## 📁 Archivos Modificados

### Backend

| Archivo | Cambios |
|---------|---------|
| `src/config/schema.sql` | `paths.posted_by_user_id` (UUID), `saved_paths` con UUIDs |
| `migrations/normalize-foreign-keys.js` | **NUEVA** migración para DBs existentes |
| `src/repositories/pathRepository.js` | `createPath` usa `posted_by_user_id`, `getPathsByUserId` |
| `src/repositories/savedPathRepository.js` | `savePath(userId, pathId)`, `getSavedPathsByUserId`, `deleteSavedPath(userId, pathId)` |
| `src/services/path-management/pathService.js` | `getUserById(postedByUserId)`, `getPathsByUserId` |
| `src/controllers/pathController.js` | Usa `req.user.id` en lugar de `req.user.username` |
| `package.json` | Añadido script `migrate:normalize` |

### Frontend

| Archivo | Cambios |
|---------|---------|
| `pages/PathDetailScreen/PathDetailScreen.js` | `isOwner` compara `user.id` con `posted_by_user_id` |
| `pages/PathListScreen/PathListScreen.js` | Comentario actualizado |

### Documentación

| Archivo | Contenido |
|---------|-----------|
| `backend/SCHEMA_REVIEW.md` | Análisis detallado de problemas y recomendaciones |
| `backend/NORMALIZATION_CHANGES.md` | Resumen de cambios implementados y guía de migración |

---

## 🚀 Cómo Aplicar los Cambios

### Para una DB nueva (desde cero):

```bash
cd PabloJose/ITD/code/backend
npm run migrate
```

Esto ejecuta `migrations/run.js` que aplica `schema.sql` completo (ya incluye los cambios).

### Para una DB existente (con datos):

```bash
cd PabloJose/ITD/code/backend

# 1. Añadir columnas description y difficulty (si no se hizo antes)
npm run migrate:description

# 2. Normalizar FK a UUIDs
npm run migrate:normalize
```

**Importante:** La migración `normalize-foreign-keys.js` es **idempotente** (se puede ejecutar varias veces sin problemas). Usa `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, etc.

---

## ✅ Validación

Para verificar que todo funciona:

1. **Ejecutar migración:**
   ```bash
   cd backend
   npm run migrate:normalize
   ```

2. **Reiniciar backend:**
   ```bash
   npm start
   ```

3. **Crear un path desde el frontend** (PathCreateManualScreen)

4. **Verificar en la DB:**
   ```sql
   SELECT id, path_name, posted_by_user_id FROM paths LIMIT 5;
   -- posted_by_user_id debe ser un UUID, no un username
   ```

5. **Guardar un path en favoritos** desde el frontend

6. **Verificar en la DB:**
   ```sql
   SELECT * FROM saved_paths LIMIT 5;
   -- debe tener columnas user_id y path_id (UUIDs)
   ```

7. **Ver "My paths" y "Saved paths"** en el frontend

---

## 📊 Datos que se Guardan Ahora

| Usuario introduce | Tabla | Columnas | Estado |
|-------------------|--------|----------|---------|
| **Registro:** email, password, name | `users` | id, username (=email), password_hash, full_name, email | ✅ |
| **Path:** name, description, start/end, distance, difficulty, coords, routeData, weather, duration | `paths` | Todas (incluye description, difficulty, weather, duration_minutes, **posted_by_user_id**) | ✅ |
| **Review:** pathId, points, opinion | `ratings` | id, user_id, path_id, points, opinion, reported_status | ✅ |
| **Favorito:** guardar path | `saved_paths` | **user_id, path_id** (UUIDs), saved_at | ✅ |
| **Trip:** fecha, distancia, rating, weather, route | `trips` | user_id, path_id, trip_date, trip_length, personal_rating, weather, recorded_route | ✅ |

---

## 🎯 Beneficios

1. **Integridad referencial robusta:** Los UUIDs no cambian; usernames/path_names sí.
2. **Rendimiento:** JOINs por UUID son más rápidos que por VARCHAR.
3. **Consistencia:** Todas las FK ahora son UUIDs (antes era mixto).
4. **Sin redundancia:** `username` y `path_name` solo son datos, no claves foráneas.
5. **Favoritos no se rompen:** Si se renombra un path, los favoritos siguen funcionando.

---

## ⚠️ Nota Importante: Username en Frontend

El backend ya **NO devuelve `posted_by_username`** en paths (solo `posted_by_user_id`). Si quieres mostrar el username del creador en `PathDetailScreen`:

**Opción 1:** El backend hace JOIN con `users` y devuelve el username:
```sql
SELECT paths.*, users.username AS posted_by_username
FROM paths
JOIN users ON paths.posted_by_user_id = users.id
```

**Opción 2:** El frontend hace una petición adicional a `/users/:id` (requiere crear endpoint).

Por ahora, `PathDetailScreen` muestra `"—"` si no hay username.

---

## 📝 Resumen Final

✅ Schema normalizado (UUIDs en todas las FK)  
✅ Migración `normalize-foreign-keys.js` creada  
✅ Backend actualizado (repositories, services, controllers)  
✅ Frontend actualizado (PathDetailScreen, PathListScreen)  
✅ Script `npm run migrate:normalize` añadido  
✅ Documentación completa (`SCHEMA_REVIEW.md`, `NORMALIZATION_CHANGES.md`)  

**Todo está listo para usar.** Solo necesitas ejecutar `npm run migrate:normalize` en el backend y reiniciar.
