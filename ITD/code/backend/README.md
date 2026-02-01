# Best Bike Paths - Backend

Backend for the Best Bike Paths system built with Express.js and a microservices architecture.

## Description

This backend provides a REST API for the Best Bike Paths mobile app. It is structured in microservices that handle different aspects of the system:

- **User Management**: User management, authentication and authorization
- **Trip Management**: Personal trip management
- **Path Management**: Route and path management
- **Path Search**: Route search and recommendation
- **Rating**: Rating and review system
- **Sensor Processing**: Sensor data processing
- **Information Merging**: Merging information from multiple users

## Technologies

- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **Redis**: Cache and sessions
- **RabbitMQ**: Message queue for asynchronous communication
- **JWT**: Authentication
- **Joi**: Data validation
- **Jest**: Testing framework

## File Structure

```
backend/
├── src/
│   ├── services/              # Microservices
│   │   ├── user-management/
│   │   ├── trip-management/
│   │   ├── path-management/
│   │   ├── path-search/
│   │   ├── rating/
│   │   ├── sensor-processing/
│   │   └── information-merging/
│   ├── api-gateway/          # API Gateway (routing, auth, validation)
│   ├── repositories/         # Data access layer
│   ├── models/               # Data models
│   ├── utils/                # Utilities
│   ├── config/               # Configuration
│   │   ├── database.js       # PostgreSQL
│   │   ├── redis.js          # Redis
│   │   └── rabbitmq.js       # RabbitMQ
│   └── app.js                # Main application
├── tests/                    # Integration tests
├── migrations/               # Database migrations
├── docker/                   # Dockerfiles
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (or use Docker)
- Redis (or use Docker)
- RabbitMQ (or use Docker)

### Steps

1. **Install dependencies:**

```bash
npm install
```

2. **Environment variables:** The `.env` file is already configured in the project. If you need to change it, edit `.env` with your settings.

3. **Start Docker services (if using Docker):**

```bash
# From the project root
docker-compose up -d
```

4. **Run migrations (when available):**

```bash
npm run migrate
```

## Usage

### Development

```bash
npm run dev
```

Starts the server with nodemon for hot-reload.

### Production

```bash
npm start
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Configuration

### Environment Variables

The main environment variables are:

- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port (default: 3000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL configuration
- `REDIS_URL`: Redis connection URL
- `RABBITMQ_URL`: RabbitMQ connection URL
- `JWT_SECRET`: Secret for JWT
- `JWT_EXPIRES_IN`: Token expiration time

Variables are configured in the backend `.env` file.

## API Endpoints

### Health Check

```
GET /health
```

Returns the service status.

### Authentication

Authentication endpoints are available at `/api/v1/auth/`.

### Microservices

Each microservice exposes its endpoints under `/api/v1/{service-name}/`.

## Development

### Adding a New Microservice

1. Create a new directory in `src/services/`
2. Implement the service logic
3. Register the routes in `src/routes/` and `src/app.js`
4. Add tests in `tests/`

### Microservice Structure

```javascript
// src/services/example-service/index.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // Service logic
});

module.exports = router;
```

### Repositories

Repositories in `src/repositories/` provide an abstraction layer over the database.

### Models

Models in `src/models/` define the data structure.

## Testing

Tests are organized in `tests/` and use Jest and Supertest.

### Running Tests

```bash
npm test
```

### Test Structure

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

## Migrations

Database migrations are in `migrations/`. Use the migration script:

```bash
npm run migrate
```

## Docker

### Development Dockerfile

A `Dockerfile.dev` is available in `docker/` for development with hot-reload.

### Production Dockerfile

A production Dockerfile can be created as needed.

## Troubleshooting

### PostgreSQL connection error

- Verify PostgreSQL is running
- Verify credentials in `.env`
- Verify the port is not in use

### Redis connection error

- Verify Redis is running
- Verify the URL in `.env`

### RabbitMQ connection error

- Verify RabbitMQ is running
- Verify the URL in `.env`
- Access the management UI at http://localhost:15672

## License

ISC

## Authors

BBP Team - Software Engineering 2 Project
