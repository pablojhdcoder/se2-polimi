# Compilation script for the Acceptance Testing Document (ATD)
# This script compiles the LaTeX document and generates the PDF

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Compiling Acceptance Testing Document (ATD)..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update PATH to include MiKTeX if installed
$miktexPath = "C:\Users\pablo\AppData\Local\Programs\MiKTeX\miktex\bin\x64"
if (Test-Path $miktexPath) {
    if ($env:Path -notlike "*$miktexPath*") {
        $env:Path = "$miktexPath;$env:Path"
    }
}

# Check if pdflatex is installed
$pdflatex = Get-Command pdflatex -ErrorAction SilentlyContinue

if (-not $pdflatex) {
    Write-Host "ERROR: pdflatex is not installed." -ForegroundColor Red
    Write-Host "Please install MiKTeX from: https://miktex.org/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "pdflatex found: $($pdflatex.Source)" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path "ATD.tex")) {
    Write-Host "ERROR: ATD.tex file not found" -ForegroundColor Red
    Write-Host "Run this script from the folder containing ATD.tex (PabloJose/ATD)" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
}

Write-Host "Compiling first pass (draft mode)..." -ForegroundColor Yellow
$null = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build ATD.tex 2>&1

Write-Host "Compiling second pass (draft mode - resolving references)..." -ForegroundColor Yellow
$null = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build ATD.tex 2>&1

Write-Host "Compiling final pass (generating PDF)..." -ForegroundColor Yellow
$result3 = & pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build ATD.tex 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation reported errors. Check build\ATD.log" -ForegroundColor Red
}

if (Test-Path "build\ATD.pdf") {
    Move-Item -Path "build\ATD.pdf" -Destination "ATD.pdf" -Force
}

if (Test-Path "ATD.pdf") {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Compilation successful! ATD.pdf generated." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

    $pdfSize = (Get-Item "ATD.pdf").Length / 1KB
    Write-Host "PDF size: $([math]::Round($pdfSize, 2)) KB" -ForegroundColor Cyan
    Write-Host ""

    Start-Sleep -Seconds 1

    $open = Read-Host "Do you want to open the PDF? (Y/N)"
    if ($open -eq "Y" -or $open -eq "y" -or $open -eq "S" -or $open -eq "s") {
        $pdfPath = (Resolve-Path "ATD.pdf").Path
        Start-Process $pdfPath
    }
} else {
    Write-Host "ERROR: Could not generate PDF. Check build\ATD.log" -ForegroundColor Red
}
