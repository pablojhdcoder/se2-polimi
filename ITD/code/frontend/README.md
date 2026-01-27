# Best Bike Paths - Frontend (Mobile App)

Aplicación móvil React Native para Best Bike Paths construida con Expo.

## Descripción

Esta aplicación móvil permite a los usuarios:
- Registrarse e iniciar sesión
- Buscar y visualizar rutas en bicicleta
- Registrar viajes personales con detección automática
- Calificar y revisar rutas
- Detectar obstáculos durante el viaje
- Ver estadísticas de viajes

## Tecnologías

- **React Native**: Framework móvil
- **Expo**: Herramientas y servicios para React Native
- **React Navigation**: Navegación
- **AsyncStorage**: Almacenamiento local
- **React Native Sensors**: Acceso a sensores (GPS, acelerómetro, giroscopio)
- **Axios**: Cliente HTTP
- **React Native Maps**: Mapas (opcional)

## Estructura de Archivos

```
frontend/
├── src/
│   ├── components/           # Componentes UI reutilizables
│   ├── screens/              # Pantallas de la aplicación
│   ├── services/             # Servicios API
│   │   ├── api.js           # Cliente API configurado
│   │   └── sensors/         # Gestión de sensores
│   │       └── SensorManager.js
│   ├── utils/               # Utilidades
│   ├── navigation/          # Configuración de navegación
│   ├── storage/             # Gestión de almacenamiento local
│   └── sensors/             # Módulos de sensores
│       ├── trip-detection/  # Detección de viajes
│       └── obstacle-detection/ # Detección de obstáculos
├── __tests__/               # Tests
├── App.js                   # Componente principal
├── babel.config.js          # Configuración Babel
├── metro.config.js          # Configuración Metro bundler
├── app.json                 # Configuración Expo
├── package.json
└── README.md
```

## Instalación

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI (se instala automáticamente)
- Para iOS: Xcode (solo macOS)
- Para Android: Android Studio

### Pasos

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con la URL de tu API backend.

3. **Iniciar la aplicación:**

```bash
npm start
```

Esto abrirá Expo DevTools. Puedes:
- Presionar `a` para abrir en Android emulator
- Presionar `i` para abrir en iOS simulator (solo macOS)
- Escanear el QR code con Expo Go app en tu dispositivo físico

## Uso

### Desarrollo

```bash
# Iniciar Expo
npm start

# Android
npm run android

# iOS (solo macOS)
npm run ios

# Web
npm run web
```

### Testing

```bash
# Ejecutar tests
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

## Configuración

### Variables de Entorno

Las variables de entorno deben comenzar con `EXPO_PUBLIC_` para ser accesibles en la app:

- `EXPO_PUBLIC_API_URL`: URL del backend API (default: http://localhost:3000/api/v1)
- `EXPO_PUBLIC_ENV`: Entorno (development, production)

Ver `.env.example` para más detalles.

### app.json

El archivo `app.json` contiene la configuración de Expo, incluyendo:
- Nombre de la app
- Iconos y splash screen
- Permisos (ubicación, etc.)
- Configuración de iOS y Android

## Componentes Principales

### SensorManager

El `SensorManager` (`src/services/sensors/SensorManager.js`) gestiona el acceso a:
- **GPS**: Ubicación del dispositivo
- **Acelerómetro**: Aceleración en 3 ejes
- **Giroscopio**: Rotación en 3 ejes

Ejemplo de uso:

```javascript
import SensorManager from './src/services/sensors/SensorManager';

// Iniciar monitoreo
await SensorManager.startAll({
  gps: (data) => {
    console.log('GPS:', data);
  },
  accelerometer: (data) => {
    console.log('Accelerometer:', data);
  },
  gyroscope: (data) => {
    console.log('Gyroscope:', data);
  }
});

// Detener monitoreo
SensorManager.stopAll();
```

### API Client

El cliente API (`src/services/api.js`) está configurado con:
- Interceptores para agregar tokens de autenticación
- Manejo de errores global
- Manejo de tokens expirados

Ejemplo de uso:

```javascript
import apiClient from './src/services/api';

// GET request
const response = await apiClient.get('/paths');

// POST request
const newPath = await apiClient.post('/paths', {
  name: 'My Path',
  coordinates: [...]
});
```

## Navegación

La navegación está configurada con React Navigation. Las pantallas se registran en `App.js`.

### Agregar una Nueva Pantalla

1. Crea el componente de pantalla en `src/screens/`
2. Regístrala en `App.js`:

```javascript
import NewScreen from './src/screens/NewScreen';

// En el Stack.Navigator
<Stack.Screen name="NewScreen" component={NewScreen} />
```

## Permisos

La aplicación requiere los siguientes permisos:

- **Ubicación**: Para rastrear viajes y encontrar rutas
- **Ubicación en segundo plano**: Para rastrear viajes mientras la app está en segundo plano

Los permisos se solicitan automáticamente cuando se usan los sensores.

## Testing

Los tests usan Jest y React Native Testing Library.

### Ejecutar Tests

```bash
npm test
```

### Estructura de Tests

```javascript
// __tests__/components/Example.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import ExampleComponent from '../src/components/Example';

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ExampleComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

## Build y Deploy

### Desarrollo

Para desarrollo, usa Expo Go app o un emulador/simulador.

### Producción

Para crear builds de producción:

```bash
# Android
expo build:android

# iOS
expo build:ios
```

O usa EAS Build (recomendado):

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Troubleshooting

### Error de conexión al backend

- Verifica que el backend esté corriendo
- Verifica `EXPO_PUBLIC_API_URL` en `.env`
- Para Android emulator, usa `10.0.2.2` en lugar de `localhost`
- Para iOS simulator, `localhost` funciona

### Error de permisos de ubicación

- Verifica que los permisos estén configurados en `app.json`
- En Android, verifica `AndroidManifest.xml` (generado por Expo)
- En iOS, verifica `Info.plist` (generado por Expo)

### Error de sensores no disponibles

- Algunos sensores no están disponibles en simuladores/emuladores
- Prueba en un dispositivo físico
- Verifica que los permisos estén otorgados

## Licencia

ISC

## Autores

BBP Team - Software Engineering 2 Project
