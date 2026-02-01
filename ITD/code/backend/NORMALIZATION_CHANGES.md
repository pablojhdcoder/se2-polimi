# Normalización del Schema - Cambios Implementados

## Resumen

Se ha normalizado completamente el schema de la base de datos para eliminar redundancias y usar UUIDs consistentemente en todas las claves foráneas.

---

## Cambios en el Schema (schema.sql)

### 1. Tabla `paths`
**Antes:**
- `posted_by_username VARCHAR(50)` FK a `users(username)`

**Después:**
- `posted_by_user_id UUID` FK a `users(id)`

**Impacto:** Todas las referencias a paths ahora usan el ID del usuario en lugar del username. Esto evita problemas si se cambia el username en el futuro y mejora el rendimiento de JOINs.

### 2. Tabla `saved_paths`
**Antes:**
- PK: `(username, path_name)`
- FK: `username` → `users(username)`, `path_name` → `paths(path_name)`

**Después:**
- PK: `(user_id, path_id)`
- FK: `user_id` → `users(id)`, `path_id` → `paths(id)`

**Impacto:** Favoritos ahora se vinculan por UUIDs. Si se renombra un path o un username, los favoritos no se rompen.

---

## Migración para Bases de Datos Existentes

Se creó `migrations/normalize-foreign-keys.js` que:

1. Añade `posted_by_user_id` a `paths`
2. Popula el nuevo campo desde `posted_by_username` (usando JOIN con `users`)
3. Elimina `posted_by_username` y su FK antigua
4. Crea nueva tabla `saved_paths_new` con UUIDs
5. Migra datos de `saved_paths` antigua a la nueva
6. Reemplaza `saved_paths` antigua por la nueva

**Ejecutar:**
```bash
cd backend
npm run migrate:normalize
```

---

## Cambios en Backend

### Repositorios Actualizados

**pathRepository.js:**
- `createPath`: usa `posted_by_user_id` en INSERT
- `getPathsByUsername` → `getPathsByUserId`: consulta por UUID

**savedPathRepository.js:**
- `savePath(userId, pathId)`: usa UUIDs en INSERT
- `getSavedPathsByUsername` → `getSavedPathsByUserId`: JOIN con `paths` por UUID
- `deleteSavedPath(userId, pathId)`: usa UUIDs en DELETE

### Servicios Actualizados

**pathService.js:**
- `addPath`: usa `getUserById(path.postedByUserId)` en lugar de `getUserByUsername`
- `getPathsByUsername` → `getPathsByUserId`: expone nuevo método

### Controladores Actualizados

**pathController.js:**
- `createPath`: extrae `req.user.id` y lo asigna a `pathData.postedByUserId`
- `savePath`: usa `req.user.id` y `pathId` (del parámetro `:id`)
- `getSavedPaths`: usa `req.user.id` para obtener favoritos
- `unsavePath`: usa `req.user.id` y `pathId`
- `getMyPaths`: usa `req.user.id` para obtener paths del usuario
- `patchPath`: compara `path.posted_by_user_id` con `req.user.id` para verificar ownership

---

## Cambios en Frontend

**PathDetailScreen.js:**
- `isOwner`: ahora compara `user.id` con `p.posted_by_user_id` (en lugar de username)
- `postedBy`: muestra "—" si no hay username (el backend ya no devuelve username en paths)

**PathListScreen.js:**
- Comentario actualizado: "by posted_by_user_id" en lugar de "by posted_by_username"

---

## Beneficios de la Normalización

1. **Integridad referencial robusta:** UUIDs no cambian; usernames/path_names sí pueden cambiar.
2. **Rendimiento:** JOINs por UUID (índice en PK) son más rápidos que por VARCHAR.
3. **Consistencia:** Todas las tablas ahora usan UUIDs para FK (antes era mixto).
4. **Sin redundancia de claves naturales:** `username` y `path_name` solo se usan como campos de datos, no como claves foráneas.

---

## Ejecución de Migraciones

### Para una base de datos nueva (desde cero):
```bash
cd backend
npm run migrate
# o npm run migrate:schema
```

Esto ejecuta `migrations/run.js`, que aplica `src/config/schema.sql` completo (ya incluye los cambios).

### Para una base de datos existente:
```bash
cd backend
# 1. Añadir description y difficulty (si aún no se hizo)
npm run migrate:description

# 2. Normalizar FK a UUIDs
npm run migrate:normalize
```

---

## Notas Importantes

- **`req.user` debe tener `id` y `username`:** El middleware de autenticación (`authenticateToken`) debe decodificar el JWT y añadir ambos campos a `req.user`. El JWT se genera en `authService.login` con `{ id: user.id, username: user.username }`.

- **Backend ya no devuelve `posted_by_username` en paths:** Si el frontend necesita mostrar el username del creador, debe hacer una petición adicional al endpoint de usuarios (no implementado aún) o el backend debe hacer un JOIN y devolver el username (requeriría actualizar `pathRepository.getAllPaths`, `getPathById`, etc. para incluir `SELECT users.username`).

- **Retrocompatibilidad temporal:** El código frontend aún soporta `posted_by_username` y `postedByUsername` como fallback para datos cacheados, pero el nuevo flujo usa `posted_by_user_id`.

---

## Validación

Para validar que todo funciona:

1. Ejecutar migración `npm run migrate:normalize` en backend
2. Reiniciar backend: `npm start`
3. Crear un path desde el frontend (PathCreateManualScreen)
4. Verificar en DB que `paths.posted_by_user_id` tiene el UUID del usuario
5. Guardar un path en favoritos
6. Verificar en DB que `saved_paths` tiene `(user_id, path_id)` con UUIDs
7. Ver la lista de "My paths" en frontend
8. Ver los paths guardados (favoritos) en frontend

---

**Documento generado el:** 2026-02-01  
**Cambios aplicados por normalización completa del schema**
