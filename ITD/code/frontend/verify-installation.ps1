# Script de verificación de instalación de paquetes
# Verifica que todas las dependencias estén correctamente instaladas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificación de Instalación - Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. Verificar que node_modules existe
Write-Host "1. Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem -Path "node_modules" -Directory | Measure-Object).Count
    Write-Host "   [OK] node_modules existe con $packageCount paquetes" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] node_modules no existe" -ForegroundColor Red
    $errors++
}

# 2. Verificar paquetes principales
Write-Host ""
Write-Host "2. Verificando paquetes principales..." -ForegroundColor Yellow
$requiredPackages = @(
    "react",
    "react-native",
    "expo",
    "@react-navigation/native",
    "@react-native-async-storage/async-storage",
    "@react-native-community/geolocation",
    "react-native-sensors",
    "react-native-maps",
    "axios"
)

foreach ($package in $requiredPackages) {
    $packagePath = "node_modules\$package"
    if (Test-Path $packagePath) {
        Write-Host "   [OK] $package" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] $package no encontrado" -ForegroundColor Red
        $errors++
    }
}

# 3. Verificar dependencias faltantes o con problemas
Write-Host ""
Write-Host "3. Verificando integridad de dependencias..." -ForegroundColor Yellow
$npmCheck = npm list --depth=0 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Todas las dependencias están instaladas correctamente" -ForegroundColor Green
} else {
    $missing = $npmCheck | Select-String -Pattern "missing|UNMET|extraneous"
    if ($missing) {
        Write-Host "   [WARNING] Algunas dependencias pueden tener problemas:" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "            $_" -ForegroundColor Yellow }
        $warnings++
    } else {
        Write-Host "   [OK] Dependencias verificadas" -ForegroundColor Green
    }
}

# 4. Verificar vulnerabilidades
Write-Host ""
Write-Host "4. Verificando vulnerabilidades de seguridad..." -ForegroundColor Yellow
$audit = npm audit --json 2>&1 | ConvertFrom-Json
if ($audit.metadata.vulnerabilities) {
    $high = $audit.metadata.vulnerabilities.high
    $critical = $audit.metadata.vulnerabilities.critical
    if ($critical -gt 0) {
        Write-Host "   [ERROR] $critical vulnerabilidades críticas encontradas" -ForegroundColor Red
        $errors++
    } elseif ($high -gt 0) {
        Write-Host "   [WARNING] $high vulnerabilidades de alta severidad encontradas" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "   [OK] No hay vulnerabilidades críticas o de alta severidad" -ForegroundColor Green
    }
} else {
    Write-Host "   [OK] No se encontraron vulnerabilidades" -ForegroundColor Green
}

# 5. Verificar que los archivos de configuración existen
Write-Host ""
Write-Host "5. Verificando archivos de configuración..." -ForegroundColor Yellow
$configFiles = @(
    "package.json",
    "babel.config.js",
    "metro.config.js",
    "app.json",
    "App.js"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "   [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "   [WARNING] $file no encontrado" -ForegroundColor Yellow
        $warnings++
    }
}

# 6. Verificar que Expo CLI está disponible
Write-Host ""
Write-Host "6. Verificando Expo CLI..." -ForegroundColor Yellow
$expoCheck = npx expo --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Expo CLI disponible: $expoCheck" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Expo CLI no disponible (se instalará automáticamente al ejecutar 'npm start')" -ForegroundColor Yellow
    $warnings++
}

# 7. Verificar versiones instaladas vs requeridas
Write-Host ""
Write-Host "7. Resumen de versiones instaladas:" -ForegroundColor Yellow
$versions = @{
    "react" = (npm list react --depth=0 2>&1 | Select-String -Pattern "react@").ToString().Split('@')[1].Split(' ')[0]
    "react-native" = (npm list react-native --depth=0 2>&1 | Select-String -Pattern "react-native@").ToString().Split('@')[1].Split(' ')[0]
    "expo" = (npm list expo --depth=0 2>&1 | Select-String -Pattern "expo@").ToString().Split('@')[1].Split(' ')[0]
}

foreach ($pkg in $versions.Keys) {
    if ($versions[$pkg]) {
        Write-Host "   $pkg : $($versions[$pkg])" -ForegroundColor White
    }
}

# Resumen final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "[OK] Verificación completada sin errores" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Puedes iniciar el proyecto con:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "[OK] Verificación completada con $warnings advertencia(s)" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "El proyecto debería funcionar correctamente." -ForegroundColor Green
    Write-Host "Las advertencias son principalmente sobre vulnerabilidades menores." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Puedes iniciar el proyecto con:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    exit 0
} else {
    Write-Host "[ERROR] Verificación completada con $errors error(es) y $warnings advertencia(s)" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Por favor, corrige los errores antes de continuar." -ForegroundColor Red
    Write-Host "Intenta ejecutar: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}
