# TRADEY Docker Setup Script
# Ova skripta builuje i pokrece sve Docker kontejnere

Write-Host "=== TRADEY Docker Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Zaustavi i ukloni stare kontejnere
Write-Host "1. Zaustavljanje starih kontejnera..." -ForegroundColor Yellow
docker stop tradey-backend-container tradey-frontend-container 2>$null
docker rm tradey-backend-container tradey-frontend-container 2>$null

# 2. Napravi Docker network ako ne postoji
Write-Host "2. Kreiranje Docker network..." -ForegroundColor Yellow
docker network create tradey-network 2>$null

# 3. Build backend image
Write-Host "3. Building backend Docker image..." -ForegroundColor Yellow
docker build -t tradey-backend:1.0 --build-arg NODE_ENV=production ./backend

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend build failed!" -ForegroundColor Red
    exit 1
}

# 4. Build frontend image
Write-Host "4. Building frontend Docker image..." -ForegroundColor Yellow
docker build `
  --build-arg VITE_FIREBASE_API_KEY=AIzaSyCqGrnMqTeMGWOmmpKHjZn3S99-WZ0yzWs `
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com `
  --build-arg VITE_FIREBASE_PROJECT_ID=vibe-hakaton `
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app `
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904 `
  --build-arg VITE_FIREBASE_APP_ID=1:225908111904:web:36ffedcbbdfd2ed0b85a45 `
  --build-arg VITE_FIREBASE_MEASUREMENT_ID=G-1KRVHGJHVZ `
  --build-arg VITE_API_URL=http://localhost:5000/api `
  -t tradey-frontend:1.0 `
  ./frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}

# 5. Pokreni backend kontejner
Write-Host "5. Pokretanje backend kontejnera..." -ForegroundColor Yellow
docker run -d `
  --name tradey-backend-container `
  --network tradey-network `
  -p 5000:5000 `
  -v tradey-firebase-data:/app/firebase-data `
  -v "${PWD}/backend/logs:/app/logs" `
  -e NODE_ENV=production `
  -e PORT=5000 `
  --restart unless-stopped `
  --cpus="1.0" `
  --memory="512m" `
  tradey-backend:1.0

# 6. Pokreni frontend kontejner
Write-Host "6. Pokretanje frontend kontejnera..." -ForegroundColor Yellow
docker run -d `
  --name tradey-frontend-container `
  --network tradey-network `
  -p 5173:3000 `
  --restart unless-stopped `
  tradey-frontend:1.0

# 7. Provera statusa
Write-Host ""
Write-Host "=== Status kontejnera ===" -ForegroundColor Cyan
docker ps --filter "name=tradey"

Write-Host ""
Write-Host "=== Aplikacija je pokrenuta! ===" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Logovi backend:  docker logs -f tradey-backend-container" -ForegroundColor Gray
Write-Host "Logovi frontend: docker logs -f tradey-frontend-container" -ForegroundColor Gray
