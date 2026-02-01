# Configuración del backend (contenedores, base de datos, RabbitMQ, Redis)

Guía basada en los **`.env`** en **`code/backend/`** y **`code/frontend/`**. No hay `.env` en la raíz de `code/`: las variables de Docker se leen desde **`backend/.env`**.

---

## ¿Backend en Docker o en local?

Para una **demo** o desarrollo habitual, es más práctico:

- **Infraestructura en Docker** (PostgreSQL, Redis, RabbitMQ).
- **Backend en tu PC** (`npm run dev` en `code/backend/`).

Ventajas: ver logs en la terminal, depurar con el IDE, sin rebuild de imagen. El resto de esta guía asume esta opción. Si más adelante quieres el backend también en Docker, al final se indica cómo.

---

## Qué .env hay y para qué sirven

| Archivo | Uso |
|--------|-----|
| **`code/backend/.env`** | Lo usa el **backend** en local y también **Docker Compose**: DB_*, REDIS_*, RABBITMQ_*, JWT, APIs, email. Al levantar contenedores desde `code/` hay que usar **`--env-file backend/.env`**. |
| **`code/frontend/.env`** | Lo usa **Expo**: `EXPO_PUBLIC_API_URL`, Mapbox, etc. |

---

## Requisitos

- **Docker Desktop** instalado y en marcha.
- **Node.js >= 18** y **npm >= 9** (para el backend y migraciones).

---

## Pasos para arrancar el backend (demo / desarrollo)

Sigue este orden cada vez que quieras tener la API funcionando (o la primera vez después de `docker-compose down -v`).

### 1. Levantar contenedores (PostgreSQL, Redis, RabbitMQ)

Desde la carpeta **`code/`**:

```powershell
cd c:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\ITD\code
docker-compose --env-file backend/.env up -d
```

Los contenedores usan las variables de **`backend/.env`** (DB_*, REDIS_PORT, RABBITMQ_*). La contraseña de Postgres será la que tengas en **`DB_PASSWORD`** en ese archivo.

Comprueba que estén en marcha:

```powershell
docker ps
```

Deberías ver: **bbp-postgres**, **bbp-redis**, **bbp-rabbitmq**.

### 2. Crear las tablas en la base de datos (solo la primera vez o tras borrar volúmenes)

Desde la carpeta **`code/backend/`**:

```powershell
cd c:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\ITD\code\backend
npm install
npm run migrate
```

Debe aparecer: **Schema aplicado correctamente.**

**Si ya tenías la base de datos creada antes** y ves el error `null value in column "path_id" of relation "trips"` al iniciar un viaje automático, ejecuta una vez la migración que permite `path_id` NULL:

```powershell
node migrations/alter-trips-path-id-nullable.js
```

Así los viajes grabados sin ruta asociada (p. ej. "Store locally" en Review path) podrán guardarse y el aviso "pending item(s) to sync" desaparecerá al sincronizar.

Si falla con "password authentication failed", la **`DB_PASSWORD`** en **`backend/.env`** no coincide con la que usó el contenedor Postgres. Como levantas con `--env-file backend/.env`, ambas son la misma; si ya tenías contenedores creados antes con otra contraseña, pon en **`backend/.env`** esa misma contraseña o recrea todo con `docker-compose down -v` y vuelve al paso 1.

### 3. Arrancar el backend

En la misma carpeta **`code/backend/`**:

```powershell
npm run dev
```

El backend queda en **http://localhost:3000**. Comprueba: [http://localhost:3000/health](http://localhost:3000/health) → `{"status":"ok",...}`.

### 4. Parar todo cuando termines

- **Backend:** `Ctrl+C` en la terminal donde corre `npm run dev`.
- **Contenedores:**

```powershell
cd c:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\ITD\code
docker-compose down
```

Con **`docker-compose down -v`** se borran también los volúmenes (datos de Postgres, Redis, RabbitMQ). La próxima vez tendrás que ejecutar de nuevo el **paso 2** (migración).

---

## Uso de puertos en la app

Cada servicio usa un puerto distinto; no hay solapamiento entre backend, frontend y Docker.

| Servicio        | Puerto | Quién lo usa | Dónde se configura |
|-----------------|--------|--------------|--------------------|
| **Backend**     | **3000** | API Express (`npm run dev` / `npm start`) | `backend/.env` → `PORT=3000` |
| **Expo / Metro**| **8081** (o 8082 si 8081 está ocupado) | Bundler del frontend (`npm start` en `frontend/`) | Por defecto en Expo; no choca con 3000 |
| **PostgreSQL**  | 5432   | Contenedor Docker | `backend/.env` → `DB_PORT=5432` |
| **Redis**       | 6379   | Contenedor Docker | `backend/.env` → `REDIS_PORT=6379` |
| **RabbitMQ**    | 5672   | Contenedor Docker | `backend/.env` → `RABBITMQ_PORT=5672` |
| **RabbitMQ Management** | 15672 | Panel web RabbitMQ | `backend/.env` → `RABBITMQ_MANAGEMENT_PORT=15672` |

- El **frontend** no abre ningún puerto propio para la API: usa **`EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1`** en `frontend/.env` para llamar al backend en el **3000**.
- El puerto **3000** debe usarlo **solo** el backend. Si ves **EADDRINUSE** en 3000, es que **otro** proceso (otra instancia del backend, otra app) ya está escuchando ahí; liberar ese proceso con `taskkill` permite que **tu** backend use 3000.

---

## Frontend (Expo) y API

**`code/frontend/.env`** debe tener:

- `EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1`

Válido para emulador o Expo en el mismo PC. **Si usas Expo Go en el móvil físico** (o a veces en emulador), `localhost` apunta al dispositivo y no al PC, por eso verás "Network Error" al registrar o hacer login. **Solución:** pon la IP de tu PC en la misma WiFi, p. ej. `EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api/v1`. En emulador Android puedes usar `http://10.0.2.2:3000/api/v1`. Después reinicia Expo (`npx expo start`).

**Mapa (Mapbox):** La app usa **@rnmapbox/maps** para el mapa. Este paquete **no funciona en Expo Go** porque requiere código nativo. Para ver el mapa en dispositivo o emulador hay que hacer un **development build**: desde `code/frontend/` ejecuta `npx expo prebuild --clean` y luego `npx expo run:ios` o `npx expo run:android` (o usa EAS Build). El token de Mapbox se lee de **`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`** en `frontend/.env`.

---

## Opcional: Backend también en Docker

Si prefieres que el backend corra dentro de un contenedor (mismo entorno que en producción, sin instalar Node en el PC):

1. Desde **`code/`**:

```powershell
docker-compose --env-file backend/.env -f docker-compose.dev.yml up -d
```

Se levantan Postgres, Redis, RabbitMQ y **bbp-backend-dev** en el puerto 3000.

2. Migración (una vez): desde **`code/`**:

```powershell
docker-compose --env-file backend/.env -f docker-compose.dev.yml run --rm backend npm run migrate
```

3. Comprobar: [http://localhost:3000/health](http://localhost:3000/health). Logs del backend: `docker logs -f bbp-backend-dev`.

4. Parar: `docker-compose -f docker-compose.dev.yml down` (o `down -v` para borrar volúmenes).

**Nota:** Si RabbitMQ rechaza la conexión del backend en contenedor, en **`backend/.env`** usa un usuario distinto de `guest`, p. ej. `RABBITMQ_USER=bbp` y `RABBITMQ_PASSWORD=bbp`.

---

## Datos de ejemplo y pruebas manuales

Para probar la app con datos ya cargados (usuarios, rutas, valoraciones con comentarios, viajes y favoritos):

### Ejecutar el seed

Desde la carpeta **`code/backend/`** (con la base de datos creada y las tablas aplicadas):

```powershell
cd c:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\ITD\code\backend
npm run seed
```

O desde la raíz del repo: `node PabloJose/ITD/code/backend/scripts/seed-demo-data.js` (las variables de entorno DB_* deben estar disponibles, p. ej. desde `backend/.env`).

- **`--force`**: borra antes los datos demo existentes (usuarios demo@*, sus rutas, valoraciones, viajes y favoritos) y vuelve a insertar. Úsalo si quieres resetear los datos de prueba.

### Credenciales de prueba

Tras ejecutar el seed puedes iniciar sesión en la app con cualquiera de estos usuarios:

| Email               | Contraseña  |
|---------------------|-------------|
| demo@example.com    | Demo123!    |
| demo2@example.com   | Demo123!    |
| demo3@example.com   | Demo123!    |

### Pasos sugeridos para probar manualmente

1. **Levantar backend y frontend** (contenedores, migración, `npm run dev` en backend; `npx expo start` en frontend).
2. **Ejecutar el seed** si la base está vacía: `cd backend && npm run seed`.
3. **Iniciar sesión** en la app con `demo@example.com` / `Demo123!`.
4. **Pestaña Ratings**: ver la lista de valoraciones (reviews) con nombres de ruta y comentarios; tocar una para ver el detalle.
5. **Pestaña Past trips**: ver los viajes anteriores del usuario demo.
6. **Pestaña Favorites**: ver las rutas guardadas; si no hay ninguna, guarda una desde la lista de rutas (Paths) o desde el detalle de una ruta.
7. **Map / Paths**: buscar rutas, guardar una como favorita (si la API lo permite desde la UI) y comprobar que aparece en Favorites.

---

## Problemas frecuentes

1. **"Connection refused" a Postgres/Redis/RabbitMQ**  
   Comprueba que los contenedores estén en marcha: `docker ps`. Levanta siempre con **`--env-file backend/.env`** desde `code/`.

2. **"password authentication failed for user postgres"**  
   La **`DB_PASSWORD`** en **`backend/.env`** no coincide con la del contenedor. Si acabas de hacer `docker-compose down -v` y vuelves a levantar con `--env-file backend/.env`, el contenedor usará la contraseña de **`backend/.env`**; asegúrate de que el backend use la misma. Si los contenedores se crearon antes con otra contraseña, pon esa en **`backend/.env`** o recrea con `down -v` y `up -d` de nuevo.

3. **Las tablas no existen**  
   Ejecuta una vez: `cd backend && npm run migrate`.

4. **Docker: "cannot find the file specified" / pipe dockerDesktopLinuxEngine**  
   Docker Desktop no está en marcha. Ábrelo y espera a que inicie por completo, luego vuelve a ejecutar el comando.

5. **"listen EADDRINUSE: address already in use :::3000"**  
   El puerto 3000 lo debe usar **solo** el backend. Ese error indica que **otro** proceso (otra instancia del backend que no cerraste, u otra app) ya está escuchando en 3000. Para liberar el puerto: `netstat -ano | findstr :3000` (la última columna es el PID) y luego `taskkill /PID <número> /F`. Después vuelve a ejecutar `npm start` o `npm run dev` en `code/backend/`.
