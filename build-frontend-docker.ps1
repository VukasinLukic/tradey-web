# Build frontend Docker image sa environment variables

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

Write-Host "Frontend Docker image built successfully!" -ForegroundColor Green
