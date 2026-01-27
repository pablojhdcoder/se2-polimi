# Cleanup script for the Integration Testing Document
# This script removes all LaTeX auxiliary files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleaning auxiliary files..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Close PDF viewer if open
$pdfProcesses = Get-Process | Where-Object { 
    $_.MainWindowTitle -like "*ITD*" -or 
    $_.ProcessName -eq "Acrobat" -or 
    $_.ProcessName -eq "AcroRd32" -or
    $_.ProcessName -eq "SumatraPDF" -or
    $_.ProcessName -eq "FoxitReader" -or
    $_.ProcessName -eq "PDFXEdit"
}

if ($pdfProcesses) {
    Write-Host "Closing open PDF viewers..." -ForegroundColor Yellow
    $pdfProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-Host "  - Closed: $($_.ProcessName)" -ForegroundColor Gray
        } catch {
            # Ignore errors when closing processes
        }
    }
    Start-Sleep -Seconds 1
}

# List of auxiliary file extensions to remove
$auxExtensions = @(".aux", ".log", ".lof", ".lot", ".toc", ".out", ".bbl", ".blg", ".nav", ".snm", ".synctex.gz", ".fdb_latexmk", ".fls")

$deletedCount = 0

# Clean files in root directory
foreach ($ext in $auxExtensions) {
    $files = Get-ChildItem -Filter "*$ext" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        try {
            Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
            Write-Host "  Deleted: $($file.Name)" -ForegroundColor Gray
            $deletedCount++
        } catch {
            Write-Host "  Could not delete: $($file.Name)" -ForegroundColor Yellow
        }
    }
}

# Clean files in build directory
if (Test-Path "build") {
    Write-Host ""
    Write-Host "Cleaning build/ directory..." -ForegroundColor Cyan
    foreach ($ext in $auxExtensions) {
        $files = Get-ChildItem -Path "build" -Filter "*$ext" -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            try {
                Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
                Write-Host "  Deleted: build\$($file.Name)" -ForegroundColor Gray
                $deletedCount++
            } catch {
                Write-Host "  Could not delete: build\$($file.Name)" -ForegroundColor Yellow
            }
        }
    }
    
    # Also remove PDF from build if it exists (it should be in root)
    if (Test-Path "build\ITD.pdf") {
        try {
            Remove-Item "build\ITD.pdf" -Force -ErrorAction SilentlyContinue
            Write-Host "  Deleted: build\ITD.pdf" -ForegroundColor Gray
        } catch {
            Write-Host "  Could not delete: build\ITD.pdf" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
if ($deletedCount -gt 0) {
    Write-Host "Deleted $deletedCount auxiliary file(s)." -ForegroundColor Green
} else {
    Write-Host "No auxiliary files found to delete." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green
