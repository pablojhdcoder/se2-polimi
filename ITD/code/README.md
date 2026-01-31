# Best Bike Paths (BBP) - Proyecto Completo

Sistema de recomendación de rutas en bicicleta basado en microservicios con aplicación móvil React Native.

## Descripción del Proyecto

Best Bike Paths es una aplicación que permite a los usuarios:
- Registrar y compartir rutas en bicicleta
- Buscar las mejores rutas según diferentes criterios
- Registrar viajes personales con detección automática
- Calificar y revisar rutas
- Detectar obstáculos durante el viaje
- Obtener recomendaciones basadas en datos de sensores y calificaciones de usuarios

## Arquitectura

El proyecto sigue una arquitectura de microservicios:

- **Backend**: Express.js con múltiples microservicios
- **Frontend**: React Native (Expo) para iOS y Android
- **Base de Datos**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose**
- **Git**

Para desarrollo móvil:
- **Expo CLI** (se instala automáticamente con npm)
- **Xcode** (para iOS, solo en macOS)
- **Android Studio** (para Android)

## Instalación

### Opción 1: Script Automático (Recomendado)

Ejecuta el script de setup:

```powershell
.\setup.ps1
```

Este script:
1. Verifica las instalaciones necesarias
2. Comprueba que existan los archivos `.env` (backend y frontend ya configurados)
3. Instala dependencias del backend y frontend
4. Inicia los servicios Docker

### Opción 2: Instalación Manual

#### 1. Variables de Entorno

Los archivos `.env` del backend y del frontend están ya configurados en el proyecto. Si necesitas modificarlos, edita `backend\.env` y `frontend\.env` con tus configuraciones.

#### 2. Iniciar Servicios Docker

```powershell
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- Redis en el puerto 6379
- RabbitMQ en el puerto 5672 (Management UI en 15672)

#### 3. Instalar Dependencias del Backend

```powershell
cd backend
npm install
```

#### 4. Instalar Dependencias del Frontend

```powershell
cd frontend
npm install
```

## Comandos Útiles

### Docker

```powershell
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Desarrollo con hot-reload
docker-compose -f docker-compose.dev.yml up
```

### Backend

```powershell
cd backend

# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test
npm run test:watch
npm run test:coverage

# Migraciones
npm run migrate
```

### Frontend

```powershell
cd frontend

# Iniciar Expo
npm start

# Android
npm run android

# iOS (solo macOS)
npm run ios

# Tests
npm test
npm run test:watch
```

## Estructura del Proyecto

```
code/
├── backend/                    # Backend con Express.js
│   ├── src/
│   │   ├── services/           # Microservicios
│   │   │   ├── user-management/
│   │   │   ├── trip-management/
│   │   │   ├── path-management/
│   │   │   ├── path-search/
│   │   │   ├── rating/
│   │   │   ├── sensor-processing/
│   │   │   └── information-merging/
│   │   ├── api-gateway/        # API Gateway
│   │   ├── repositories/       # Repositorios para DB
│   │   ├── models/            # Modelos de datos
│   │   ├── utils/             # Utilidades
│   │   ├── config/            # Configuración
│   │   └── app.js             # Aplicación principal
│   ├── tests/                 # Tests de integración
│   ├── migrations/            # Migraciones de DB
│   └── docker/                # Dockerfiles específicos
│
├── frontend/                   # React Native app
│   ├── src/
│   │   ├── components/        # Componentes UI
│   │   ├── screens/           # Pantallas
│   │   ├── services/          # Servicios API
│   │   ├── utils/             # Utilidades
│   │   ├── navigation/        # Navegación
│   │   ├── storage/           # Local storage
│   │   └── sensors/           # Sensor Manager
│   └── App.js
│
├── docker-compose.yml         # Servicios: PostgreSQL, Redis, RabbitMQ
├── docker-compose.dev.yml     # Desarrollo con hot-reload
└── setup.ps1                  # Script de setup inicial
```

## Servicios y Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Backend API | 3000 | API REST principal |
| PostgreSQL | 5432 | Base de datos |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ Management | 15672 | UI de gestión (usuario: guest, password: guest) |

## Desarrollo

### Backend

El backend está estructurado en microservicios. Cada servicio tiene su propia lógica de negocio y se comunica a través del API Gateway.

### Frontend

La aplicación móvil usa React Native con Expo. El SensorManager gestiona el acceso a GPS, acelerómetro y giroscopio.

## Testing

### Backend

Los tests usan Jest y Supertest:

```powershell
cd backend
npm test
```

### Frontend

Los tests usan Jest y React Native Testing Library:

```powershell
cd frontend
npm test
```

## Contribución

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Asegúrate de que los tests pasen
4. Crea un Pull Request

## Licencia

ISC

## Autores

BBP Team - Software Engineering 2 Project
