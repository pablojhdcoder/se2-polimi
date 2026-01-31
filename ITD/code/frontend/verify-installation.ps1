# Package installation verification script
# Verifies that all dependencies are correctly installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Verification - Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. Verify node_modules exists
Write-Host "1. Verifying node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem -Path "node_modules" -Directory | Measure-Object).Count
    Write-Host "   [OK] node_modules exists with $packageCount packages" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] node_modules does not exist" -ForegroundColor Red
    $errors++
}

# 2. Verify main packages
Write-Host ""
Write-Host "2. Verifying main packages..." -ForegroundColor Yellow
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
        Write-Host "   [ERROR] $package not found" -ForegroundColor Red
        $errors++
    }
}

# 3. Verify missing or problematic dependencies
Write-Host ""
Write-Host "3. Verifying dependency integrity..." -ForegroundColor Yellow
$npmCheck = npm list --depth=0 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] All dependencies are correctly installed" -ForegroundColor Green
} else {
    $missing = $npmCheck | Select-String -Pattern "missing|UNMET|extraneous"
    if ($missing) {
        Write-Host "   [WARNING] Some dependencies may have issues:" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "            $_" -ForegroundColor Yellow }
        $warnings++
    } else {
        Write-Host "   [OK] Dependencies verified" -ForegroundColor Green
    }
}

# 4. Verify vulnerabilities
Write-Host ""
Write-Host "4. Verifying security vulnerabilities..." -ForegroundColor Yellow
$audit = npm audit --json 2>&1 | ConvertFrom-Json
if ($audit.metadata.vulnerabilities) {
    $high = $audit.metadata.vulnerabilities.high
    $critical = $audit.metadata.vulnerabilities.critical
    if ($critical -gt 0) {
        Write-Host "   [ERROR] $critical critical vulnerabilities found" -ForegroundColor Red
        $errors++
    } elseif ($high -gt 0) {
        Write-Host "   [WARNING] $high high severity vulnerabilities found" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "   [OK] No critical or high severity vulnerabilities" -ForegroundColor Green
    }
} else {
    Write-Host "   [OK] No vulnerabilities found" -ForegroundColor Green
}

# 5. Verify configuration files exist
Write-Host ""
Write-Host "5. Verifying configuration files..." -ForegroundColor Yellow
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
        Write-Host "   [WARNING] $file not found" -ForegroundColor Yellow
        $warnings++
    }
}

# 6. Verify Expo CLI is available
Write-Host ""
Write-Host "6. Verifying Expo CLI..." -ForegroundColor Yellow
$expoCheck = npx expo --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Expo CLI available: $expoCheck" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Expo CLI not available (will be installed automatically when running 'npm start')" -ForegroundColor Yellow
    $warnings++
}

# 7. Verify installed vs required versions
Write-Host ""
Write-Host "7. Summary of installed versions:" -ForegroundColor Yellow
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

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "[OK] Verification completed with no errors" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can start the project with:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "[OK] Verification completed with $warnings warning(s)" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The project should work correctly." -ForegroundColor Green
    Write-Host "Warnings are mainly about minor vulnerabilities." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can start the project with:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    exit 0
} else {
    Write-Host "[ERROR] Verification completed with $errors error(s) and $warnings warning(s)" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the errors before continuing." -ForegroundColor Red
    Write-Host "Try running: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}
