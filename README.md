# TRADEY - Platforma za Razmenu Polovne Odeće

Moderan second-hand clothing trading platform koji omogućava korisnicima da razmenjuju odeću bez novca.

## 🏗️ Struktura Projekta (Monorepo)

```
tradey-web/
├── frontend/          # React + Vite aplikacija
├── backend/           # Express + Firebase Admin API
├── shared/            # Deljeni tipovi i validacije
├── docs/              # Dokumentacija projekta
└── docker-compose.yaml
```

## 🚀 Quick Start

### Preduslovi

- Node.js 18+
- npm ili yarn
- Firebase projekat (Auth + Firestore + Storage)
- Docker (opciono, za kontejnerizaciju)

### Instalacija

1. **Klonirajte repo:**
   ```bash
   git clone <repo-url>
   cd tradey-web
   ```

2. **Instalirajte zavisnosti:**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   
   # Shared
   cd ../shared
   npm install
   ```

3. **Konfigurišite environment varijable:**

   **Frontend (.env):**
   ```bash
   cd frontend
   cp .env.example .env
   # Popunite Firebase credentials
   ```

   **Backend (.env):**
   ```bash
   cd backend
   cp .env.example .env
   # Dodajte Firebase Admin SDK key path
   ```

4. **Preuzmite Firebase Service Account Key:**
   - Idite na [Firebase Console](https://console.firebase.google.com) → Project Settings → Service Accounts
   - Kliknite "Generate new private key"
   - Sačuvajte kao `backend/firebase-service-account.json`
   - **NEVER commit this file!** It's already in .gitignore

5. **Environment files are already created** with your Firebase configuration:
   - `frontend/.env` (Firebase client SDK)
   - `backend/.env` (Server configuration)

### Pokretanje (Development)

**Opcija 1: Ručno pokretanje**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

**Opcija 2: Docker Compose**

```bash
docker-compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## 📦 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Firebase Client SDK (Auth only)
- Axios
- Zustand (state management)
- Zod (validation)

### Backend
- Node.js + Express
- TypeScript
- Firebase Admin SDK
- Multer (file uploads)
- Express Rate Limit
- CORS

### Database & Services
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

## 🏛️ Arhitektura

- **Frontend**: Komunicira sa backendom preko REST API-ja
- **Backend**: Validira JWT tokene, upravlja Firestore i Storage operacijama
- **Shared**: Centralizovani tipovi i Zod validacione šeme

## 📚 Dokumentacija

- [API Documentation](docs/API.md)
- [Master Plan](docs/masterplan.md)
- [Implementation Plan](docs/implementationplan.md)
- [Project Structure](docs/struktura_projekta.md)



## 🧪 Testiranje

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

## 🐳 Docker

Build i pokretanje:
```bash
docker-compose up --build
```

Zaustavljanje:
```bash
docker-compose down
```

## 📝 Git Workflow

1. Kreirajte feature branch: `git checkout -b feature/nova-funkcija`
2. Commit-ujte izmene: `git commit -m "feat: opis izmene"`
3. Push na GitHub: `git push origin feature/nova-funkcija`
4. Kreirajte Pull Request

**Made with ❤️ for sustainable fashion**
