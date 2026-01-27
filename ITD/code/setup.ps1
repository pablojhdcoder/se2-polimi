# Setup script for Best Bike Paths project
# This script verifies installations, creates .env files, and installs dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Best Bike Paths - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
    
    # Check version
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "[WARNING] Node.js version should be >= 18.0.0" -ForegroundColor Yellow
    }
} else {
    Write-Host "[ERROR] Node.js not found. Please install Node.js >= 18.0.0" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] npm not found. Please install npm >= 9.0.0" -ForegroundColor Red
    exit 1
}

# Check Docker
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
$dockerAvailable = $false
if (Test-Command "docker") {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker found: $dockerVersion" -ForegroundColor Green
    $dockerAvailable = $true
} else {
    Write-Host "[WARNING] Docker not found. Docker is required for running services (PostgreSQL, Redis, RabbitMQ)" -ForegroundColor Yellow
    Write-Host "         You can install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "         The script will continue, but Docker services will be skipped." -ForegroundColor Yellow
}

# Check Docker Compose
Write-Host "Checking Docker Compose installation..." -ForegroundColor Yellow
if (Test-Command "docker-compose") {
    $composeVersion = docker-compose --version
    Write-Host "[OK] Docker Compose found: $composeVersion" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Docker Compose not found as standalone command (may be integrated in Docker)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating .env files..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create root .env
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] .env.example not found in root" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] .env already exists (skipped)" -ForegroundColor Green
}

# Create backend .env
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "[OK] Created backend\.env from backend\.env.example" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] backend\.env.example not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] backend\.env already exists (skipped)" -ForegroundColor Green
}

# Create frontend .env
if (-not (Test-Path "frontend\.env")) {
    if (Test-Path "frontend\.env.example") {
        Copy-Item "frontend\.env.example" "frontend\.env"
        Write-Host "[OK] Created frontend\.env from frontend\.env.example" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] frontend\.env.example not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] frontend\.env already exists (skipped)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\package.json") {
    Set-Location backend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "[WARNING] backend\package.json not found" -ForegroundColor Yellow
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\package.json") {
    Set-Location frontend
    # Use --legacy-peer-deps from the start to avoid ERESOLVE errors
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
        Write-Host "        You may need to manually run: cd frontend; npm install --legacy-peer-deps" -ForegroundColor Yellow
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "[WARNING] frontend\package.json not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Docker services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Docker services
if ($dockerAvailable) {
    Write-Host "Starting Docker Compose services..." -ForegroundColor Yellow
    if (Test-Path "docker-compose.yml") {
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Docker services started" -ForegroundColor Green
            Write-Host ""
            Write-Host "Services available at:" -ForegroundColor Cyan
            Write-Host "  - PostgreSQL: localhost:5432" -ForegroundColor White
            Write-Host "  - Redis: localhost:6379" -ForegroundColor White
            Write-Host "  - RabbitMQ: localhost:5672" -ForegroundColor White
            Write-Host "  - RabbitMQ Management: http://localhost:15672" -ForegroundColor White
        } else {
            Write-Host "[WARNING] Failed to start Docker services. You may need to start them manually." -ForegroundColor Yellow
            Write-Host "         Run: docker-compose up -d" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[WARNING] docker-compose.yml not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping Docker services (Docker not available)" -ForegroundColor Yellow
    Write-Host "To start services later, install Docker and run: docker-compose up -d" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and update .env files with your configuration" -ForegroundColor White
Write-Host "2. Start the backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "3. Start the frontend: cd frontend; npm start" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Cyan
Write-Host ""
