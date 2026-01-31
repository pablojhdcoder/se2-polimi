# Best Bike Paths - Backend

Backend del sistema Best Bike Paths construido con Express.js y arquitectura de microservicios.

## Descripción

Este backend proporciona una API REST para la aplicación móvil Best Bike Paths. Está estructurado en microservicios que manejan diferentes aspectos del sistema:

- **User Management**: Gestión de usuarios, autenticación y autorización
- **Trip Management**: Gestión de viajes personales
- **Path Management**: Gestión de rutas y caminos
- **Path Search**: Búsqueda y recomendación de rutas
- **Rating**: Sistema de calificaciones y reseñas
- **Sensor Processing**: Procesamiento de datos de sensores
- **Information Merging**: Fusión de información de múltiples usuarios

## Tecnologías

- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **Redis**: Cache y sesiones
- **RabbitMQ**: Message queue para comunicación asíncrona
- **JWT**: Autenticación
- **Joi**: Validación de datos
- **Jest**: Testing framework

## Estructura de Archivos

```
backend/
├── src/
│   ├── services/              # Microservicios
│   │   ├── user-management/
│   │   ├── trip-management/
│   │   ├── path-management/
│   │   ├── path-search/
│   │   ├── rating/
│   │   ├── sensor-processing/
│   │   └── information-merging/
│   ├── api-gateway/          # API Gateway (routing, auth, validation)
│   ├── repositories/         # Capa de acceso a datos
│   ├── models/               # Modelos de datos
│   ├── utils/                # Utilidades
│   ├── config/               # Configuraciones
│   │   ├── database.js       # PostgreSQL
│   │   ├── redis.js          # Redis
│   │   └── rabbitmq.js        # RabbitMQ
│   └── app.js                # Aplicación principal
├── tests/                    # Tests de integración
├── migrations/               # Migraciones de base de datos
├── docker/                   # Dockerfiles
├── package.json
└── README.md
```

## Instalación

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (o usar Docker)
- Redis (o usar Docker)
- RabbitMQ (o usar Docker)

### Pasos

1. **Instalar dependencias:**

```bash
npm install
```

2. **Variables de entorno:** El archivo `.env` está ya configurado en el proyecto. Si necesitas modificarlo, edita `.env` con tus configuraciones.

3. **Iniciar servicios Docker (si usas Docker):**

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

4. **Ejecutar migraciones (cuando estén disponibles):**

```bash
npm run migrate
```

## Uso

### Desarrollo

```bash
npm run dev
```

Inicia el servidor con nodemon para hot-reload.

### Producción

```bash
npm start
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

## Configuración

### Variables de Entorno

Las principales variables de entorno son:

- `NODE_ENV`: Entorno (development, production, test)
- `PORT`: Puerto del servidor (default: 3000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Configuración PostgreSQL
- `REDIS_URL`: URL de conexión a Redis
- `RABBITMQ_URL`: URL de conexión a RabbitMQ
- `JWT_SECRET`: Secreto para JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token

Las variables se configuran en el archivo `.env` del backend.

## API Endpoints

### Health Check

```
GET /health
```

Retorna el estado del servicio.

### Autenticación

Los endpoints de autenticación estarán disponibles en `/api/v1/auth/` cuando se implementen.

### Microservicios

Cada microservicio expondrá sus endpoints bajo `/api/v1/{service-name}/`.

## Desarrollo

### Agregar un Nuevo Microservicio

1. Crea un nuevo directorio en `src/services/`
2. Implementa la lógica del servicio
3. Registra las rutas en `src/api-gateway/`
4. Agrega tests en `tests/`

### Estructura de un Microservicio

```javascript
// src/services/example-service/index.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // Lógica del servicio
});

module.exports = router;
```

### Repositorios

Los repositorios en `src/repositories/` proporcionan una capa de abstracción sobre la base de datos.

### Modelos

Los modelos en `src/models/` definen la estructura de datos.

## Testing

Los tests están organizados en `tests/` y usan Jest y Supertest.

### Ejecutar Tests

```bash
npm test
```

### Estructura de Tests

```javascript
// tests/services/example-service.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Example Service', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/api/v1/example')
      .expect(200);
  });
});
```

## Migraciones

Las migraciones de base de datos están en `migrations/`. Usa el script de migración:

```bash
npm run migrate
```

## Docker

### Dockerfile de Desarrollo

Un `Dockerfile.dev` está disponible en `docker/` para desarrollo con hot-reload.

### Dockerfile de Producción

Un `Dockerfile` de producción puede ser creado según necesidades.

## Troubleshooting

### Error de conexión a PostgreSQL

- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que el puerto no esté en uso

### Error de conexión a Redis

- Verifica que Redis esté corriendo
- Verifica la URL en `.env`

### Error de conexión a RabbitMQ

- Verifica que RabbitMQ esté corriendo
- Verifica la URL en `.env`
- Accede a la UI de gestión en http://localhost:15672

## Licencia

ISC

## Autores

BBP Team - Software Engineering 2 Project
