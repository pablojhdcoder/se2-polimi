# Compilation script for the Integration Testing Document
# This script compiles the LaTeX document and generates the PDF

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Compiling Integration Testing Document..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update PATH to include MiKTeX if installed
$miktexPath = "C:\Users\pablo\AppData\Local\Programs\MiKTeX\miktex\bin\x64"
if (Test-Path $miktexPath) {
    # Only add MiKTeX to PATH if not already present
    if ($env:Path -notlike "*$miktexPath*") {
        $env:Path = "$miktexPath;$env:Path"
    }
}

# Check if pdflatex is installed
$pdflatex = Get-Command pdflatex -ErrorAction SilentlyContinue

if (-not $pdflatex) {
    Write-Host "ERROR: pdflatex is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MiKTeX from: https://miktex.org/download" -ForegroundColor Yellow
    Write-Host "Or check the INSTALL_LATEX.md file for more options." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to open the MiKTeX download page..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://miktex.org/download"
    exit 1
}

Write-Host "pdflatex found: $($pdflatex.Source)" -ForegroundColor Green
Write-Host ""

# Check that ITD.tex file exists
if (-not (Test-Path "ITD.tex")) {
    Write-Host "ERROR: ITD.tex file not found" -ForegroundColor Red
    Write-Host "Make sure to run this script from the folder containing ITD.tex" -ForegroundColor Yellow
    exit 1
}

# Create build directory if it doesn't exist
if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
}

Write-Host "Compiling first pass (draft mode - fast)..." -ForegroundColor Yellow
$result1 = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build ITD.tex 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "WARNING: First compilation had some errors." -ForegroundColor Yellow
    Write-Host "This may be normal if some chapter files are missing." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Compiling second pass (draft mode - resolving references)..." -ForegroundColor Yellow
$result2 = & pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build ITD.tex 2>&1

Write-Host ""
Write-Host "Compiling final pass (generating PDF)..." -ForegroundColor Yellow
$result3 = & pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build ITD.tex 2>&1

Write-Host ""

# Check if there were critical errors in the last compilation
if ($LASTEXITCODE -ne 0) {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "COMPILATION ERRORS:" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    # Show the last lines of the log that contain errors
    if ($result3) {
        $errorLines = $result3 | Where-Object { $_ -match "Error" -or $_ -match "Fatal" } | Select-Object -Last 10
        if ($errorLines) {
            Write-Host "Errors found:" -ForegroundColor Yellow
            foreach ($line in $errorLines) {
                Write-Host $line -ForegroundColor Red
            }
            Write-Host ""
        }
    }
    # Also show the complete log if there are critical errors
    if (Test-Path "build\ITD.log") {
        Write-Host "Last lines of the log:" -ForegroundColor Yellow
        $logLines = Get-Content "build\ITD.log" | Select-Object -Last 30
        foreach ($line in $logLines) {
            Write-Host $line
        }
        Write-Host ""
    }
}

# Move PDF from build to root directory
if (Test-Path "build\ITD.pdf") {
    Move-Item -Path "build\ITD.pdf" -Destination "ITD.pdf" -Force
}

# Check if PDF was generated
if (Test-Path "ITD.pdf") {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Compilation successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The file ITD.pdf has been generated." -ForegroundColor Green
    
    $pdfSize = (Get-Item "ITD.pdf").Length / 1KB
    Write-Host "PDF size: $([math]::Round($pdfSize, 2)) KB" -ForegroundColor Cyan
    Write-Host ""
    
    # Wait a moment to ensure the file is completely written
    Start-Sleep -Seconds 1
    
    $open = Read-Host "Do you want to open the PDF? (Y/N)"
    if ($open -eq "Y" -or $open -eq "y") {
        # Force PDF update by closing any previous instance
        $pdfPath = (Resolve-Path "ITD.pdf").Path
        Start-Process $pdfPath
    }
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: Could not generate PDF" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    Write-Host "Some files or LaTeX packages may be missing." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Generated auxiliary files (in build/):" -ForegroundColor Cyan
if (Test-Path "build") {
    Get-ChildItem -Path "build" -Filter "ITD.*" | Where-Object { $_.Extension -ne ".tex" -and $_.Extension -ne ".pdf" } | ForEach-Object {
        $fileName = $_.Name
        Write-Host "  - build\$fileName" -ForegroundColor Gray
    }
}
