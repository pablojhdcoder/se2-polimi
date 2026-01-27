# Guía de Verificación de Paquetes

## Verificación Rápida

### 1. Script Automático (Recomendado)
```powershell
.\verify-installation.ps1
```

Este script verifica:
- ✅ Existencia de node_modules
- ✅ Paquetes principales instalados
- ✅ Integridad de dependencias
- ✅ Vulnerabilidades de seguridad
- ✅ Archivos de configuración
- ✅ Expo CLI disponible

### 2. Comandos Manuales

#### Verificar que los paquetes están instalados
```powershell
npm list --depth=0
```

#### Verificar paquetes específicos
```powershell
# Verificar React
npm list react

# Verificar Expo
npm list expo

# Verificar React Native
npm list react-native
```

#### Verificar integridad de dependencias
```powershell
npm ls
```
Si no hay errores, todas las dependencias están correctamente instaladas.

#### Verificar vulnerabilidades
```powershell
# Ver todas las vulnerabilidades
npm audit

# Ver solo vulnerabilidades críticas y de alta severidad
npm audit --audit-level=high

# Intentar corregir automáticamente (puede causar breaking changes)
npm audit fix

# Forzar corrección (puede actualizar versiones mayores)
npm audit fix --force
```

#### Verificar paquetes desactualizados
```powershell
npm outdated
```

#### Verificar que el proyecto puede iniciarse
```powershell
# Verificar configuración sin iniciar
npx expo-doctor

# Iniciar en modo verificación
npm start -- --check
```

### 3. Verificación de Funcionalidad

#### Probar imports básicos
Crea un archivo temporal `test-imports.js`:
```javascript
// test-imports.js
try {
  const React = require('react');
  const ReactNative = require('react-native');
  const Expo = require('expo');
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const Geolocation = require('@react-native-community/geolocation');
  const Sensors = require('react-native-sensors');
  const Maps = require('react-native-maps');
  const Axios = require('axios');
  
  console.log('✅ Todos los imports funcionan correctamente');
} catch (error) {
  console.error('❌ Error al importar:', error.message);
}
```

Ejecuta:
```powershell
node test-imports.js
```

#### Verificar que Expo puede iniciarse
```powershell
npx expo --version
```

### 4. Solución de Problemas Comunes

#### Si faltan paquetes
```powershell
npm install --legacy-peer-deps
```

#### Si hay conflictos de versiones
```powershell
# Limpiar e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install --legacy-peer-deps
```

#### Si Expo no funciona
```powershell
# Instalar Expo CLI globalmente (opcional)
npm install -g @expo/cli

# O usar npx (recomendado)
npx expo start
```

### 5. Checklist de Verificación

Antes de comenzar a desarrollar, verifica:

- [ ] `node_modules` existe y tiene contenido
- [ ] Todos los paquetes principales están instalados
- [ ] `npm list` no muestra errores
- [ ] `npm audit` no muestra vulnerabilidades críticas
- [ ] Los archivos de configuración existen (package.json, babel.config.js, etc.)
- [ ] Expo CLI está disponible
- [ ] El proyecto puede iniciarse con `npm start`

### 6. Notas sobre Vulnerabilidades

Las vulnerabilidades reportadas en `npm audit` suelen ser:
- **Dependencias transitivas**: Vienen de paquetes que usas indirectamente
- **No críticas para desarrollo**: Afectan principalmente a producción
- **Pueden requerir actualizaciones mayores**: `npm audit fix --force` puede actualizar versiones principales

**Recomendación**: Para desarrollo, las vulnerabilidades de "high severity" en dependencias transitivas generalmente no son críticas. Puedes continuar desarrollando y corregirlas antes de producción.

### 7. Comandos Útiles Adicionales

```powershell
# Ver tamaño de node_modules
Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum

# Verificar estructura del proyecto
tree /F /A

# Limpiar caché de npm
npm cache clean --force

# Ver información del proyecto
npm info expo
```
