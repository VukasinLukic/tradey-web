# Docker Setup Instructions

## Problem

Docker Compose ne može da pokrene projekat jer nedostaju environment varijable.

## Rešenje

Kreirajte `.env` fajl u root direktorijumu projekta sa sledećim sadržajem:

```env
# Backend Environment Variables
BACKEND_NODE_ENV=production
BACKEND_PORT=5000
BACKEND_CORS_ORIGIN=http://localhost:3000

# Frontend Environment Variables
FRONTEND_PORT=3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vibe-hakaton
VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=100556062093290544739
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# API Configuration
VITE_API_URL=http://localhost:5000
```

## Firebase konfiguracija

Za Firebase varijable, potrebno je da:

1. Idete na Firebase Console (https://console.firebase.google.com/)
2. Izaberete projekat "vibe-hakaton"
3. Idete na Project Settings > General
4. U sekciji "Your apps" kliknete na "Web app" ikonu
5. Kopirate vrednosti za:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `appId` → `VITE_FIREBASE_APP_ID`
   - `measurementId` → `VITE_FIREBASE_MEASUREMENT_ID`

## Pokretanje

Nakon kreiranja `.env` fajla, pokrenite:

```bash
docker compose up
```

## Napomene

- `firebase-service-account.json` fajl je već konfigurisan
- Backend će biti dostupan na `http://localhost:5000`
- Frontend će biti dostupan na `http://localhost:3000`
