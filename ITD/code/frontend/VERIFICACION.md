# Package Verification Guide

## Quick Verification

### 1. Automatic Script (Recommended)
```powershell
.\verify-installation.ps1
```

This script verifies:
- ✅ Existence of node_modules
- ✅ Main packages installed
- ✅ Dependency integrity
- ✅ Security vulnerabilities
- ✅ Configuration files
- ✅ Expo CLI available

### 2. Manual Commands

#### Verify that packages are installed
```powershell
npm list --depth=0
```

#### Verify specific packages
```powershell
# Verify React
npm list react

# Verify Expo
npm list expo

# Verify React Native
npm list react-native
```

#### Verify dependency integrity
```powershell
npm ls
```
If there are no errors, all dependencies are correctly installed.

#### Verify vulnerabilities
```powershell
# View all vulnerabilities
npm audit

# View only critical and high severity vulnerabilities
npm audit --audit-level=high

# Try to fix automatically (may cause breaking changes)
npm audit fix

# Force fix (may update major versions)
npm audit fix --force
```

#### Verify outdated packages
```powershell
npm outdated
```

#### Verify that the project can start
```powershell
# Verify configuration without starting
npx expo-doctor

# Start in verification mode
npm start -- --check
```

### 3. Functionality Verification

#### Test basic imports
Create a temporary file `test-imports.js`:
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
  
  console.log('All imports work correctly');
} catch (error) {
  console.error('Error importing:', error.message);
}
```

Run:
```powershell
node test-imports.js
```

#### Verify that Expo can start
```powershell
npx expo --version
```

### 4. Common Troubleshooting

#### If packages are missing
```powershell
npm install --legacy-peer-deps
```

#### If there are version conflicts
```powershell
# Clean and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install --legacy-peer-deps
```

#### If Expo does not work
```powershell
# Install Expo CLI globally (optional)
npm install -g @expo/cli

# Or use npx (recommended)
npx expo start
```

### 5. Verification Checklist

Before starting development, verify:

- [ ] `node_modules` exists and has content
- [ ] All main packages are installed
- [ ] `npm list` shows no errors
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Configuration files exist (package.json, babel.config.js, etc.)
- [ ] Expo CLI is available
- [ ] The project can start with `npm start`

### 6. Notes on Vulnerabilities

Vulnerabilities reported by `npm audit` are usually:
- **Transitive dependencies**: Come from packages you use indirectly
- **Not critical for development**: Mainly affect production
- **May require major updates**: `npm audit fix --force` may update major versions

**Recommendation**: For development, "high severity" vulnerabilities in transitive dependencies are generally not critical. You can continue developing and fix them before production.

### 7. Additional Useful Commands

```powershell
# View node_modules size
Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum

# Verify project structure
tree /F /A

# Clear npm cache
npm cache clean --force

# View project info
npm info expo
```
