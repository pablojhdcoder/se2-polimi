# Script de limpieza para el documento RASD
# Este script elimina todos los archivos auxiliares de LaTeX

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Limpiando archivos auxiliares..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cerrar el visor de PDF si está abierto
$pdfProcesses = Get-Process | Where-Object { 
    $_.MainWindowTitle -like "*DocumentoRASD*" -or 
    $_.ProcessName -eq "Acrobat" -or 
    $_.ProcessName -eq "AcroRd32" -or
    $_.ProcessName -eq "SumatraPDF" -or
    $_.ProcessName -eq "FoxitReader" -or
    $_.ProcessName -eq "PDFXEdit"
}

if ($pdfProcesses) {
    Write-Host "Cerrando visores de PDF abiertos..." -ForegroundColor Yellow
    $pdfProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-Host "  - Cerrado: $($_.ProcessName)" -ForegroundColor Gray
        } catch {
            # Ignorar errores al cerrar procesos
        }
    }
    Start-Sleep -Seconds 1
}

# Lista de extensiones de archivos auxiliares a eliminar
$auxExtensions = @(".aux", ".log", ".lof", ".lot", ".toc", ".out", ".bbl", ".blg", ".nav", ".snm", ".synctex.gz", ".fdb_latexmk", ".fls")

$deletedCount = 0

# Limpiar archivos en el directorio raíz
foreach ($ext in $auxExtensions) {
    $files = Get-ChildItem -Filter "*$ext" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        try {
            Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
            Write-Host "  Eliminado: $($file.Name)" -ForegroundColor Gray
            $deletedCount++
        } catch {
            Write-Host "  No se pudo eliminar: $($file.Name)" -ForegroundColor Yellow
        }
    }
}

# Limpiar archivos en el directorio build
if (Test-Path "build") {
    Write-Host ""
    Write-Host "Limpiando directorio build/..." -ForegroundColor Cyan
    foreach ($ext in $auxExtensions) {
        $files = Get-ChildItem -Path "build" -Filter "*$ext" -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            try {
                Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
                Write-Host "  Eliminado: build\$($file.Name)" -ForegroundColor Gray
                $deletedCount++
            } catch {
                Write-Host "  No se pudo eliminar: build\$($file.Name)" -ForegroundColor Yellow
            }
        }
    }
    
    # También eliminar PDF de build si existe (debería estar en la raíz)
    if (Test-Path "build\DocumentoRASD.pdf") {
        try {
            Remove-Item "build\DocumentoRASD.pdf" -Force -ErrorAction SilentlyContinue
            Write-Host "  Eliminado: build\DocumentoRASD.pdf" -ForegroundColor Gray
        } catch {
            Write-Host "  No se pudo eliminar: build\DocumentoRASD.pdf" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
if ($deletedCount -gt 0) {
    Write-Host "Se eliminaron $deletedCount archivo(s) auxiliar(es)." -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos auxiliares para eliminar." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "¡Limpieza completada!" -ForegroundColor Green

