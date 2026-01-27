# Script de compilación para el documento RASD
# Este script compila el documento LaTeX y genera el PDF

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Compilando Documento RASD..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Actualizar PATH para incluir MiKTeX si está instalado
$miktexPath = "C:\Users\pablo\AppData\Local\Programs\MiKTeX\miktex\bin\x64"
if (Test-Path $miktexPath) {
    # Solo añadir MiKTeX al PATH si no está ya presente
    if ($env:Path -notlike "*$miktexPath*") {
        $env:Path = "$miktexPath;$env:Path"
    }
}

# Verificar si pdflatex está instalado
$pdflatex = Get-Command pdflatex -ErrorAction SilentlyContinue

if (-not $pdflatex) {
    Write-Host "ERROR: pdflatex no está instalado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instala MiKTeX desde: https://miktex.org/download" -ForegroundColor Yellow
    Write-Host "O consulta el archivo INSTALL_LATEX.md para más opciones." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona cualquier tecla para abrir la página de descarga de MiKTeX..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://miktex.org/download"
    exit 1
}

Write-Host "pdflatex encontrado: $($pdflatex.Source)" -ForegroundColor Green
Write-Host ""

# Verificar que el archivo DocumentoRASD.tex existe
if (-not (Test-Path "DocumentoRASD.tex")) {
    Write-Host "ERROR: No se encuentra el archivo DocumentoRASD.tex" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde la carpeta que contiene DocumentoRASD.tex" -ForegroundColor Yellow
    exit 1
}

# Crear directorio build si no existe
if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
}

Write-Host "Compilando primera pasada (modo borrador - rápido)..." -ForegroundColor Yellow
$result1 = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build DocumentoRASD.tex 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ADVERTENCIA: La primera compilación tuvo algunos errores." -ForegroundColor Yellow
    Write-Host "Esto puede ser normal si faltan algunos archivos de capítulos." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Compilando segunda pasada (modo borrador - resolviendo referencias)..." -ForegroundColor Yellow
$result2 = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build DocumentoRASD.tex 2>&1

Write-Host ""
Write-Host "Compilando pasada final (generando PDF)..." -ForegroundColor Yellow
$result3 = & pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build DocumentoRASD.tex 2>&1

Write-Host ""

# Verificar si hubo errores críticos en la última compilación
if ($LASTEXITCODE -ne 0) {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERRORES EN LA COMPILACION:" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    # Mostrar las últimas líneas del log que contienen errores
    if ($result3) {
        $errorLines = $result3 | Where-Object { $_ -match "Error" -or $_ -match "Fatal" } | Select-Object -Last 10
        if ($errorLines) {
            Write-Host "Errores encontrados:" -ForegroundColor Yellow
            foreach ($line in $errorLines) {
                Write-Host $line -ForegroundColor Red
            }
            Write-Host ""
        }
    }
    # Mostrar también el log completo si hay errores críticos
    if (Test-Path "build\DocumentoRASD.log") {
        Write-Host "Ultimas lineas del log:" -ForegroundColor Yellow
        $logLines = Get-Content "build\DocumentoRASD.log" | Select-Object -Last 30
        foreach ($line in $logLines) {
            Write-Host $line
        }
        Write-Host ""
    }
}

# Mover PDF de build al directorio raíz
if (Test-Path "build\DocumentoRASD.pdf") {
    Move-Item -Path "build\DocumentoRASD.pdf" -Destination "DocumentoRASD.pdf" -Force
}

# Verificar si se generó el PDF
if (Test-Path "DocumentoRASD.pdf") {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "¡Compilación exitosa!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "El archivo DocumentoRASD.pdf ha sido generado." -ForegroundColor Green
    
    $pdfSize = (Get-Item "DocumentoRASD.pdf").Length / 1KB
    Write-Host "Tamaño del PDF: $([math]::Round($pdfSize, 2)) KB" -ForegroundColor Cyan
    Write-Host ""
    
    # Esperar un momento para asegurar que el archivo esté completamente escrito
    Start-Sleep -Seconds 1
    
    $open = Read-Host "¿Deseas abrir el PDF? (S/N)"
    if ($open -eq "S" -or $open -eq "s") {
        # Forzar actualización del PDF cerrando cualquier instancia previa
        $pdfPath = (Resolve-Path "DocumentoRASD.pdf").Path
        Start-Process $pdfPath
    }
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: No se pudo generar el PDF" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Revisa los mensajes de error arriba." -ForegroundColor Yellow
    Write-Host "Puede que falten algunos archivos o paquetes LaTeX." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Archivos auxiliares generados (en build/):" -ForegroundColor Cyan
if (Test-Path "build") {
    Get-ChildItem -Path "build" -Filter "DocumentoRASD.*" | Where-Object { $_.Extension -ne ".tex" -and $_.Extension -ne ".pdf" } | ForEach-Object {
        $fileName = $_.Name
        Write-Host "  - build\$fileName" -ForegroundColor Gray
    }
}

